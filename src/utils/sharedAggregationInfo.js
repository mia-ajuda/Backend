const sharedAgreggationInfo = [
  {
    $lookup: {
      from: 'user',
      localField: 'ownerId',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'categories',
    },
  },
  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $project: {
      _id: 1,
      description: 1,
      title: 1,
      status: 1,
      ownerId: 1,
      user: {
        photo: 1,
        phone: 1,
        name: 1,
        birthday: 1,
        address: {
          city: 1,
        },
      },
      categories: {
        _id: 1,
        name: 1,
      },
    },
  },

];

module.exports = sharedAgreggationInfo;
