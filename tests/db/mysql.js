const { should, assert } = require('chai');
const {
  createConnection,
  createTable,
  create,
  read,
  update,
  del,
  drop,
  closeConnection,
} = require('../../src/db/mysql');

should();

describe('Connection', () => {
  it('Create', async () => {
    await createConnection();
  });
});

describe('Create Table', () => {
  it('should pass', async () => {
    await createTable('test', '_id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), country VARCHAR(255)');
  });
});

describe('Create', () => {
  describe('One', () => {
    it('should succeed', async () => {
      await create('test', { _id: 'uid1', name: 'John Smith', country: 'USA' });
    });
    it('should encounter a conflict', async () => {
      try {
        await create('test', { _id: 'uid1', name: 'John Smith', country: 'USA' });
      } catch (error) {
        error.statusCode.should.equal(409);
      }
    });
  });
  describe('Many', () => {
    it('should succeed', async () => {
      await create('test', [
        { _id: 'uid2', name: 'Superman', country: 'Neptune' },
        { _id: 'uid3', name: 'James Who', country: 'UK' },
        { _id: 'uid4', name: 'Kelly Ann', country: 'USA' },
      ]);
    });
    it('should encounter a conflict', async () => {
      try {
        await create('test', [
          { _id: 'uid5', name: 'Cassandra', country: 'Switzerland' },
          { _id: 'uid6', name: 'Marty Byrde', country: 'USA' },
          { _id: 'uid4', name: 'Rick Sanchez', country: 'USA' },
        ]);
      } catch (error) {
        error.statusCode.should.equal(409);
        error.nSuccess.should.equal(0);
      }
      await create('test', [
        { _id: 'uid5', name: 'Cassandra', country: 'Switzerland' },
        { _id: 'uid6', name: 'Marty Byrde', country: 'USA' },
      ]);
    });
  });
});

// Read returns doc or null if one, returns list of docs if many
describe('Read', () => {
  describe('One', () => {
    it('should find doc', async () => {
      const res = await read('test', 'uid5');
      res.name.should.equal('Cassandra');
    });
    it('should not find', async () => {
      const res = await read('test', 'fake');
      assert(res === null);
    });
    it('should find with no name', async () => {
      const res = await read('test', 'uid3', { columns: ['_id', 'country'] });
      res.should.not.have.property('name');
      res.country.should.equal('UK');
    });
  });
  describe('Many', () => {
    it('should find 3 docs', async () => {
      const res = await read('test', { country: 'USA' });
      res.should.have.lengthOf(3);
    });
    it('should find 0 docs', async () => {
      const res = await read('test', { country: 'Hungary' });
      res.should.have.lengthOf(0);
    });
    it('should get all docs', async () => {
      const res = await read('test');
      res.should.have.lengthOf(6);
      res[0]._id.should.equal('uid1');
    });
    it('should get all docs and sort by name', async () => {
      const res = await read('test', {}, { columns: ['_id'], sort: 'name', desc: false });
      res.should.have.lengthOf(6);
      res[0]._id.should.equal('uid5');
      res[0].should.not.have.property('name');
    });
    it('should get all docs and sort by name descending', async () => {
      const res = await read('test', {}, { sort: 'name', desc: true });
      res.should.have.lengthOf(6);
      res[0]._id.should.equal('uid2');
    });
    it('should get all docs and sort by name descending skip 1', async () => {
      const res = await read('test', {}, { sort: 'name', desc: true, skip: 1 });
      res.should.have.lengthOf(5);
      res[0]._id.should.equal('uid6');
    });
    it('should get all docs and sort by name descending skip 1 limit 2', async () => {
      const res = await read('test', {}, {
        sort: 'name', desc: true, skip: 1, limit: 2,
      });
      res.should.have.lengthOf(2);
      res[0]._id.should.equal('uid6');
    });
  });
});

describe('Update', () => {
  describe('One', () => {
    it('should update Superman to Spiderman', async () => {
      await update('test', 'uid2', { name: 'Spiderman', country: 'Jupiter' });
      const u2 = await read('test', 'uid2');
      u2.name.should.equal('Spiderman');
      u2.country.should.equal('Jupiter');
    });
    it('should not update', async () => {
      await update('test', 'fake', { name: 'Spiderman' });
    });
  });
  describe('Many', () => {
    it('should update all docs with country USA to Switzerland', async () => {
      await update('test', { country: 'USA' }, { country: 'Switzerland' });
      const q = await read('test', { country: 'Switzerland' });
      q.should.have.lengthOf(4);
    });
  });
});

describe('Delete', () => {
  describe('One', () => {
    it('should delete successfully', async () => {
      await del('test', 'uid4');
      let q = await read('test', 'uid4');
      assert(q === null);
      q = await read('test');
      q.should.have.lengthOf(5);
    });
    it('should not delete', async () => {
      await del('test', 'fake');
      const q = await read('test');
      q.should.have.lengthOf(5);
    });
  });
  describe('Many', () => {
    it('should delete all Switzerland', async () => {
      await del('test', { country: 'Switzerland' });
      const q = await read('test');
      q.should.have.lengthOf(2);
    });
    it('should delete none', async () => {
      await del('test', { country: 'UK', name: 'fake' });
      const q = await read('test');
      q.should.have.lengthOf(2);
    });
    it('should delete one', async () => {
      await del('test', { country: 'UK', name: 'James Who' });
      const q = await read('test');
      q.should.have.lengthOf(1);
    });
  });
});

describe('Drop Table', () => {
  it('should return true', async () => {
    const res = await drop('test');
    res.should.equal(true);
  });
  it('should return false', async () => {
    const res = await drop('fake');
    res.should.equal(false);
  });
});

describe('Connection', () => {
  it('Close', async () => {
    await closeConnection();
  });
});
