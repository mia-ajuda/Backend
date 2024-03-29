const SocialNetworkRepository = require('../repository/SocialNetworkRepository');
const HelpRepository = require('../repository/HelpRepository');
const OfferdHelpRepository = require('../repository/HelpOfferRepository');
const UserRepository = require('../repository/UserRepository');
const mapSocialNetworkUser = require('../utils/mapSocialNetworkUser');
const CampaignRepository = require('../repository/CampaignRepository');

class SocialNetworkService {
  constructor() {
    this.socialNetworkRepository = new SocialNetworkRepository();
    this.helpRepository = new HelpRepository();
    this.offerdHelpRepository = new OfferdHelpRepository();
    this.campaignRepository = new CampaignRepository();
  }

  async createSocialNetworkUser(createdUser) {
    const socialProfileData = {
      username: createdUser.name,
      userId: createdUser._id,
    };

    const createdSocialNetworkUser = await this.socialNetworkRepository.create(
      socialProfileData,
    );
    return createdSocialNetworkUser;
  }

  async removeSocialNetworkUser(id) {
    await this.socialNetworkRepository.destroy(id);
  }

  async followUser(selectedProfileId, userId) {
    const selectedProfile = await this.socialNetworkRepository.findUserProfilebyProfileId(
      selectedProfileId,
    );
    const userProfile = await this.socialNetworkRepository.findUserProfilebyUserId(userId);

    if (!userProfile) {
      throw new Error('User profile not found');
    } else if (!selectedProfile) {
      throw new Error('Selected profile not found');
    }

    const followerPosition = selectedProfile.followers.indexOf(userProfile._id);
    const followingPosition = userProfile.following.indexOf(selectedProfileId);
    if (followerPosition > -1 || followingPosition > -1) {
      throw new Error('Usuário já é um seguidor');
    }

    selectedProfile.followers.push(userProfile._id);
    userProfile.following.push(selectedProfileId);

    await this.socialNetworkRepository.updateProfile(userProfile);
    await this.socialNetworkRepository.updateProfile(selectedProfile);

    return true;
  }

  async unfollowUser(selectedProfileId, userId) {
    const selectedProfile = await this.socialNetworkRepository.findUserProfilebyProfileId(
      selectedProfileId,
    );
    const userProfile = await this.socialNetworkRepository.findUserProfilebyUserId(userId);

    if (!userProfile) {
      throw new Error('User profile not found');
    } else if (!selectedProfile) {
      throw new Error('Selected profile not found');
    }

    const followerPosition = selectedProfile.followers.indexOf(userProfile._id);
    const followingPosition = userProfile.following.indexOf(selectedProfileId);
    if (followerPosition < 0 || followingPosition < 0) {
      throw new Error('Usuário não é um seguidor');
    }

    selectedProfile.followers.splice(followerPosition, 1);
    userProfile.following.splice(followingPosition, 1);

    await this.socialNetworkRepository.updateProfile(selectedProfile);
    await this.socialNetworkRepository.updateProfile(userProfile);
    return false;
  }

  async findUsers(userId, username) {
    const userProfile = await this.socialNetworkRepository.findUserProfilebyUserId(userId);
    const users = await this.socialNetworkRepository.findUsersbyName(
      userProfile.id,
      username,
    );

    if (!users) {
      throw new Error('Nenhum usuário encontrado');
    }
    return users;
  }

  async getUserActivities(userId) {
    const helper = false;
    const statusList = [
      'waiting',
      'on_going',
      'finished',
      'owner_finished',
      'helper_finished',
    ];
    const getOtherUsers = true;
    const categoryArray = null;

    const helps = await this.helpRepository.getHelpListByStatus(
      userId,
      statusList,
      helper,
    );

    const offers = await this.offerdHelpRepository.list(
      userId,
      false,
      categoryArray,
      getOtherUsers,
    );

    const campaigns = await this.campaignRepository.listByOwnerId(userId);

    const activities = { helps, offers, campaigns };
    return activities;
  }

  async getFollowers(userId, selectedProfileId) {
    const userProfile = await this.socialNetworkRepository.findUserProfilebyUserId(userId);
    const followers = await this.socialNetworkRepository.getFollowers(
      userProfile.id,
      selectedProfileId,
    );

    return followers;
  }

  async getFollowing(userId, selectedProfileId) {
    const userProfile = await this.socialNetworkRepository.findUserProfilebyUserId(userId);
    const following = await this.socialNetworkRepository.getFollowing(
      userProfile.id,
      selectedProfileId,
    );

    return following;
  }

  async getUserProfile(userId, senderEmail) {
    const userRepository = new UserRepository();
    const senderUser = await userRepository.getUserByEmail(senderEmail);
    const senderProfile = await this.socialNetworkRepository.findUserProfilebyUserId(
      senderUser._id,
    );
    const userProfile = await this.socialNetworkRepository.findUserProfilebyUserId(userId);
    return mapSocialNetworkUser(userProfile, senderProfile.id);
  }
}

module.exports = SocialNetworkService;
