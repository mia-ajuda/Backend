class test_validateOwnerAndHelpedUser {
  async test_validateOwnerAndHelpedUser(helpedId, helpOffer) {
    var ct1: boolean = false;
    var ct2: boolean = false;
    var ct3: boolean = false;
    var ct4: boolean = false;
    var ct5: boolean = false;
    var ct6: boolean = false;

    if (helpOffer.ownerId === helpedId) var ct = true;
    if (helpOffer.ownerId !== helpedId) var ct2 = true;
    if (
      helpOffer.helpedUserId != null &&
      helpOffer.helpedUserId.includes(helpedId)
    )
      var ct3 = true;
    if (
      helpOffer.helpedUserId != null &&
      helpOffer.helpedUserId.includes(helpedId) == false
    )
      var ct4 = true;
    if (
      helpOffer.helpedUserId == null &&
      helpOffer.helpedUserId.includes(helpedId)
    )
      var ct5 = true;
    if (
      helpOffer.helpedUserId == null &&
      helpOffer.helpedUserId.includes(helpedId) == false
    )
      var ct6 = true;
  }
}
