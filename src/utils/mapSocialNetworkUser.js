const mapSocialNetworkUser = (socialNetworkUser, userProfileId) => {
  const isFollowing = socialNetworkUser.followers.includes(userProfileId);
  const { numberOfFollowers, numberOfFollowing } = socialNetworkUser;
  const mappedUser = {
    _id: socialNetworkUser._id,
    username: socialNetworkUser.username,
    userId: socialNetworkUser.userId,
    photo: socialNetworkUser.user?.photo,
    cpf: socialNetworkUser.user?.cpf,
    cnpj: socialNetworkUser.user?.cnpj,
    numberOfFollowers,
    numberOfFollowing,
    isFollowing,
  };
  return mappedUser;
};

module.exports = mapSocialNetworkUser;
