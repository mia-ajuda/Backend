const mapSocialNetworkUser = (socialNetworkUser, userProfileId) => {
  const isFollowing = socialNetworkUser.followers.includes(userProfileId);
  const followsYou = socialNetworkUser.following.includes(userProfileId);
  const { numberOfFollowers, numberOfFollowing } = socialNetworkUser;
  const mappedUser = {
    _id: socialNetworkUser._id,
    id: socialNetworkUser._id,
    username: socialNetworkUser.username,
    userId: socialNetworkUser.userId,
    photo: socialNetworkUser.user?.photo,
    cpf: socialNetworkUser.user?.cpf,
    cnpj: socialNetworkUser.user?.cnpj,
    biography: socialNetworkUser.user?.biography,
    followers: socialNetworkUser.followers,
    following: socialNetworkUser.following,
    numberOfFollowers,
    numberOfFollowing,
    isFollowing,
    followsYou,
  };
  return mappedUser;
};

module.exports = mapSocialNetworkUser;
