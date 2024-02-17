module.exports = class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFileds = ['page', 'sort', 'limit', 'fields'];
    excludeFileds.forEach((el) => delete queryObj[el]);

    // queryObj = { anyfield: { gte: '5' } } correct this to  { anyfield: { $gte: '5' }}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-_id');
    }
    return this;
  }
};
