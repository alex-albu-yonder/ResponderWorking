angular.module('verklizan.umox.mobile').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/account/controllers/changePassword.html',
    "<div class=\"accountPage passwordPage page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"_ChangePassword_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"centeredControls\">\r" +
    "\n" +
    "            <form name=\"changePasswordForm\" autocomplete=\"off\" novalidate=\"\">\r" +
    "\n" +
    "                <p class=\"textWidthRestriction\" i18n=\"_ChangePassword_Header_\"></p>\r" +
    "\n" +
    "                <div class=\"centerDiv\">\r" +
    "\n" +
    "                    <div ng-show=\"!usernameRetrieved\">\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && changePasswordForm.username.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <input name=\"username\" class=\"input-large\" type=\"text\" required\r" +
    "\n" +
    "                               ng-model=\"formData.username\" i18n-placeholder=\"_Username_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && changePasswordForm.oldPassword.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <input name=\"oldPassword\" class=\"input-large\" type=\"password\" required\r" +
    "\n" +
    "                               ng-model=\"formData.oldPassword\" i18n-placeholder=\"_OldPassword_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && changePasswordForm.passwordInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && changePasswordForm.passwordInput.$error.equals\" i18n=\"_ResetPassword_PasswordNotEqual_\"></div>\r" +
    "\n" +
    "                        <input name=\"passwordInput\" class=\"input-large\" type=\"password\" required di-equals=\"formData.passwordReentered\"\r" +
    "\n" +
    "                               ng-model=\"formData.newPassword\" i18n-placeholder=\"_Password_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && changePasswordForm.passwordReenteredInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <input name=\"passwordReenteredInput\" class=\"input-large\" type=\"password\" required\r" +
    "\n" +
    "                               ng-model=\"formData.passwordReentered\" i18n-placeholder=\"_PasswordReentered_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn roundedBtn-large\" ng-click=\"changePassword()\" i18n=\"_Send_\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/account/controllers/login.html',
    "<div class=\"accountPage loginPage page flex-container\">\r" +
    "\n" +
    "    <div class=\"spinner\" ng-show=\"loading\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"centerDiv flex-item\">\r" +
    "\n" +
    "        <img class=\"centerDiv responderLogo\" src=\"../../shared/img/backgrounds/ResponderApp_1024x1024.png\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"centeredControls flex-item\">\r" +
    "\n" +
    "        <form class=\"centeredControls\" ng-submit=\"login()\" autocomplete=\"off\" novalidate=\"\">\r" +
    "\n" +
    "            <p class=\"error\" ng-show=\"localizedErrorMessage\" i18n=\"{{localizedErrorMessage}}\"></p>\r" +
    "\n" +
    "            <input class=\"input-large block\" type=\"text\" required ng-model=\"username\" i18n-placeholder=\"_Username_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <input class=\"input-large block\" type=\"password\" required ng-model=\"password\" i18n-placeholder=\"_Password_\" />\r" +
    "\n" +
    "            <p class=\"error\" ng-show=\"invalid\" i18n=\"_Login_Invalid_\"></p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <button class=\"btn roundedBtn-large\" type=\"submit\" ng-disabled=\"loading\" i18n=\"_Login_Ok_\" />\r" +
    "\n" +
    "            <a class=\"textWhite forgotPassword\" ng-click=\"navigate('accountPages/requestResetPassword')\" i18n=\"_Login_ForgotPassword_\"></a>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"flex-item\">\r" +
    "\n" +
    "        <div class=\"logoContainer\" ng-class=\"{logoBanner : appearanceSettings.BannerVisible}\">\r" +
    "\n" +
    "            <img ng-if=\"!appearanceSettings.LogoBase64\" src=\"../../shared/img/umo-app_300x68.png\" />\r" +
    "\n" +
    "            <img ng-if=\"appearanceSettings.LogoBase64\" ng-src=\"{{createBase64String()}}\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"footer text-center row-fluid\">\r" +
    "\n" +
    "            <div class=\"span8\" />\r" +
    "\n" +
    "            <div class=\"span4\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" ng-disabled=\"loading\" type=\"button\" ng-click=\"navigate('firstStart/defineUrl')\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/actions/Settings_white_128x128.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/account/controllers/requestResetPassword.html',
    "<div class=\"accountPage passwordPage page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"_RequestResetPassword_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"centeredControls\">\r" +
    "\n" +
    "            <form name=\"forgotPasswordForm\" autocomplete=\"off\" novalidate=\"\">\r" +
    "\n" +
    "                <p class=\"textWidthRestriction\" i18n=\"_ResetPassword_InputExplanation_\"></p>\r" +
    "\n" +
    "                <div class=\"centerDiv\">\r" +
    "\n" +
    "                    <div class=\"error\" ng-show=\"isSubmitted && forgotPasswordForm.usernameInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                    <input name=\"usernameInput\" class=\"input-large\" type=\"text\" required ng-model=\"username\" i18n-placeholder=\"_Username_\" />\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn roundedBtn-large\" ng-click=\"sendResetPasswordRequest(username)\" i18n=\"_Send_\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/account/controllers/resetPassword.html',
    "<div class=\"accountPage passwordPage page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"_ResetPassword_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"centeredControls\">\r" +
    "\n" +
    "            <form name=\"resetPasswordForm\" autocomplete=\"off\" novalidate=\"\">\r" +
    "\n" +
    "                <p class=\"textWidthRestriction\" i18n=\"_ResetPassword_GiveToken_\"></p>\r" +
    "\n" +
    "                <div class=\"centerDiv\">\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && resetPasswordForm.usernameInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <input name=\"usernameInput\" class=\"input-large\" type=\"text\" required ng-model=\"formData.username\" i18n-placeholder=\"_Username_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && resetPasswordForm.passwordInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && resetPasswordForm.passwordInput.$error.equals\" i18n=\"_ResetPassword_PasswordNotEqual_\"></div>\r" +
    "\n" +
    "                        <input name=\"passwordInput\" class=\"input-large\" type=\"password\" required di-equals=\"formData.passwordReentered\"\r" +
    "\n" +
    "                               ng-model=\"formData.password\" i18n-placeholder=\"_Password_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && resetPasswordForm.passwordReenteredInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <input name=\"passwordReenteredInput\" class=\"input-large\" type=\"password\" required\r" +
    "\n" +
    "                               ng-model=\"formData.passwordReentered\" i18n-placeholder=\"_PasswordReentered_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <div class=\"error\" ng-show=\"isSubmitted && resetPasswordForm.activationCodeInput.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "                        <input name=\"activationCodeInput\" class=\"input-large\" type=\"text\" required\r" +
    "\n" +
    "                               ng-model=\"formData.activationCode\" i18n-placeholder=\"_ResetPassword_ActivationCodePlaceholder_\" />\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn roundedBtn-large\" ng-click=\"resetPassword()\" i18n=\"_Send_\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/careRequests/controllers/careRequestDetail.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-header-first-line-localized=\"_CareRequestDetail_Title_\" ></header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"contentPaddingExceptBottom\">\r" +
    "\n" +
    "            <span ng-show=\"!isLoading()\" class=\"pull-right verticalImages\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/info_outline_black_48x48.png\"\r" +
    "\n" +
    "                     class=\"smallImageSize touchArea\" \r" +
    "\n" +
    "                     ng-click=\"navigateToSubscriberDetail()\" />\r" +
    "\n" +
    "                <img ng-show=\"!canShowMaps() && allowAddNotesInResponder\" \r" +
    "\n" +
    "                     src=\"../../shared/img/actions/NewNote_black_128x128.png\" \r" +
    "\n" +
    "                     class=\"smallImageSize touchArea\"\r" +
    "\n" +
    "                     ng-click=\"createNewNote(careRequest.SubscriberId)\" />\r" +
    "\n" +
    "                <img ng-show=\"canShowMaps()\" src=\"../../shared/img/actions/Navigate_black_128x128.png\" \r" +
    "\n" +
    "                     class=\"smallImageSize touchArea\"\r" +
    "\n" +
    "                     ng-click=\"openNavigation(careRequest.Adress)\" />\r" +
    "\n" +
    "            </span>\r" +
    "\n" +
    "            <span>\r" +
    "\n" +
    "                <care-request-list-item pr-navigation-from-list-item-enabled=\"true\"\r" +
    "\n" +
    "                                        pr-care-request-item=\"careRequest\"\r" +
    "\n" +
    "                                        pr-care-request-limited-reason=\"false\"></care-request-list-item>\r" +
    "\n" +
    "            </span>            \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-show=\"canShowMaps() && !mapErrorMessage\" class=\"subcontent\" ui-map=\"myMap\" ui-options=\"mapOptions\" />\r" +
    "\n" +
    "        <div ng-show=\"canShowMaps() && mapErrorMessage\" class=\"subcontent\" >\r" +
    "\n" +
    "            <div class=\"contentPadding centerDiv\" i18n=\"{{mapErrorMessage}}\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-show=\"canShowStatusTime()\" class=\"subcontent contentPadding\">\r" +
    "\n" +
    "            <table class=\"tableItemPadding\">\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <img src=\"../../shared/img/caregivers-active_72x72.png\" class=\"mediumImageSize\" />\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <div i18n=\"_CareRequestDetail_TimeAccepted_\"></div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <div ng-bind=\"(careRequest.TimeAccepted | MStoJSDateTime) || emptyDateFormat\"></div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <img src=\"../../shared/img/residences-green_72x72.png\" class=\"mediumImageSize\" />\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <div i18n=\"_CareRequestDetail_TimeArrived_\"></div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <div ng-bind=\"(careRequest.TimeArrived | MStoJSDateTime) || emptyDateFormat\"></div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <img src=\"../../shared/img/subscriber-active_72x72.png\" class=\"mediumImageSize\" />\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <div i18n=\"_CareRequestDetail_TimeDone_\"></div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td>\r" +
    "\n" +
    "                        <div ng-bind=\"(careRequest.TimeDone | MStoJSDateTime) || emptyDateFormat\"></div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "            </table>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv spaceBetweenElements\">\r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" ng-click=\"setCareRequestStatus(careRequestStatus.Accept)\"\r" +
    "\n" +
    "                    ng-show=\"canAcceptWithoutSpeech()\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/CareRequests_CanGo_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                <div i18n=\"_CareRequestDetail_ICanGo_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" ng-click=\"setCareRequestToCall()\"\r" +
    "\n" +
    "                    ng-show=\"canAcceptWithSpeech()\" >\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/Contact_256x256.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                <div i18n=\"_CareRequestDetail_AcceptCall_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" ng-click=\"setCareRequestStatus(careRequestStatus.Decline)\"\r" +
    "\n" +
    "                    ng-show=\"careRequest.Status === careRequestStatus.Send || careRequest.Status === careRequestStatus.RequestReceived\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/CareRequests_CannotGo_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                <div i18n=\"_CareRequestDetail_ICannotGo_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "             \r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" ng-click=\"declineSpeechRequest()\"\r" +
    "\n" +
    "                    ng-show=\"canClickDeclineCall()\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/Contact_256x256.png\" class=\"smallImageSize rotate-for-decline-call\" />\r" +
    "\n" +
    "                <div i18n=\"_CareRequestDetail_DeclineCall_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" \r" +
    "\n" +
    "                    ng-click=\"setCareRequestStatus(careRequestStatus.Arrived)\"\r" +
    "\n" +
    "                    ng-show=\"careRequest.Status === careRequestStatus.Accept && allowActionArrived\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/CareRequests_Arrived_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                <div i18n=\"_CareRequestDetail_Arrived_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" \r" +
    "\n" +
    "                    ng-click=\"setCareRequestStatus(careRequestStatus.Done)\"\r" +
    "\n" +
    "                    ng-show=\"canClickDone()\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/CareRequests_Done_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                <div i18n=\"_CareRequestDetail_Done_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/careRequests/controllers/careRequestUpdate.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-header-first-line-localized=\"_CareRequestUpdate_Title_\" ></header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content contentPadding\">\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"upperAndLowerPadding\">\r" +
    "\n" +
    "            <span i18n=\"_CareRequestUpdate_NewStatus_\"></span>: <span i18n=\"{{newStatus | careRequestStatusToText}}\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <textarea i18n-placeholder=\"_CareRequestUpdate_RemarkPlaceholder_\" name=\"content\" \r" +
    "\n" +
    "                  class=\"inputFullWidth\" rows=\"3\" ng-model=\"statusUpdateRemark\" maxlength=\"{{remarkCharacterCountLimit}}\"></textarea>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div ng-show=\"remarkPercentageCharactersAvailable() < 20 && !remarkIsToLong()\" class=\"warning\">\r" +
    "\n" +
    "            Amount of characters left to finish the remark: {{remarkCharactersStillAvailable()}}\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"error\" ng-show=\"remarkIsToLong()\"\r" +
    "\n" +
    "             i18n=\"_CareRequestUpdate_RemarkToLong_\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" ng-disabled=\"loading\" type=\"button\" ng-click=\"sendStatusUpdate()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/actions/Approved_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                    <div i18n=\"_CareRequestUpdate_SendUpdate_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>   \r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/careRequests/directives/careRequestListItem.html',
    "\r" +
    "\n" +
    "<h4 ng-class=\"{error: careRequestItem.Status <= 2}\" ng-click=\"navigateToSubscriberDetail()\">\r" +
    "\n" +
    "    <span ng-bind=\"careRequestItem.SubscriberName\"></span> - <span i18n=\"{{careRequestItem.Status | careRequestStatusToText}}\"></span>\r" +
    "\n" +
    "    <img ng-show=\"careRequestItem.IsWithSpeech && showSpeechIcon\" \r" +
    "\n" +
    "         class=\"pull-right x-smallImageSize smallContentPadding\"  src=\"../../shared/img/actions/Contact_Black_256x256.png\" />\r" +
    "\n" +
    "</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<table style=\"display: block\" class=\"tableItemPadding\">\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "        <td i18n=\"_HomePage_CareRequests_Alarm_\"></td>\r" +
    "\n" +
    "        <td class=\"textGray\" ng-bind=\"careRequestItem.AlarmFiredTime | MStoJSDateTime\"></td>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "        <td i18n=\"_HomePage_CareRequests_Address_\"></td>\r" +
    "\n" +
    "        <td class=\"textGray\" ng-bind=\"careRequestItem.Adress\"></td>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "        <td i18n=\"_HomePage_CareRequests_Phonenr_\"></td>\r" +
    "\n" +
    "        <td ng-show=\"careRequestItem.SubscriberPhoneNumber\">\r" +
    "\n" +
    "            <a ng-if=\"navigationFromListItemEnabled\"\r" +
    "\n" +
    "               href=\"tel:{{careRequestItem.SubscriberPhoneNumber}}\"\r" +
    "\n" +
    "               ng-bind=\"careRequestItem.SubscriberPhoneNumber\"></a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <span ng-if=\"!navigationFromListItemEnabled\" ng-bind=\"careRequestItem.SubscriberPhoneNumber\"></span>\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "        <td ng-show=\"!careRequestItem.SubscriberPhoneNumber\" i18n=\"_Unknown_\" />\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "</table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"smallContentPadding\" ng-class=\"{ellipseContent : limitReason}\">{{careRequestItem.Reason}}</div>"
  );


  $templateCache.put('js/common/controllers/about.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-header-first-line-localized=\"_About_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <div class=\"about\">\r" +
    "\n" +
    "            <div class=\"imgContainer\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/umo-app_300x68.png\" ng-click=\"clickedAppLogo()\" />\r" +
    "\n" +
    "                <p class=\"text-right\">\r" +
    "\n" +
    "                    <span ng-bind=\"appVersion\"></span>\r" +
    "\n" +
    "                    <span ng-if=\"appIsDebugBuild\">d</span>\r" +
    "\n" +
    "                    (<span ng-bind=\"serviceVersion\"></span>)\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"copyrightNotice\">\r" +
    "\n" +
    "                <span i18n=\"_About_Copyright_\" /><br />\r" +
    "\n" +
    "                <span i18n=\"_About_CompanyName_\" /><br />\r" +
    "\n" +
    "                <p i18n=\"_About_RightsReserved_\" />\r" +
    "\n" +
    "                <a ng-show=\"isInDebugMode\" i18n=\"_NavigateToDebugSettings_\" ng-click=\"navigateToDebugPage()\"></a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_About_Disclaimer_\" />\r" +
    "\n" +
    "            <p class=\"textGray\" i18n=\"_About_DisclaimerContent_\" />\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"vkzLogoFooter contentPadding\">\r" +
    "\n" +
    "        <img src=\"../../shared/img/verklizan_191x50.png\" width=\"115\" height=\"30\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/controllers/autoComplete.html',
    "<div class=\"page\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"{{title}}\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <input type=\"text\" i18n-placeholder=\"_TypeToFilter_\" autofocus class=\"contentPadding input-block-level\"  ng-model=\"filterText\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\" ng-repeat=\"item in items track by item.Id\">\r" +
    "\n" +
    "            <div class=\"imgInlineHeading \" ng-click=\"selectItem(item)\">\r" +
    "\n" +
    "                <h4 ng-bind=\"item.Name\"></h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div  ng-show=\"items.length < totalCount && loading === false\"\r" +
    "\n" +
    "             ng-click=\"showMore()\"\r" +
    "\n" +
    "             i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "             class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "        <div ng-show=\"show3CharactersRequired\" class=\"error\" i18n=\"_MoreThan3CharactersRequired_\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/common/controllers/debugSettings.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-header-first-line-localized=\"_DebugSettings_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_General_\"></legend>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"select-FullWidth upperAndLowerPadding\">\r" +
    "\n" +
    "                <div class=\"pull-right\"> \r" +
    "\n" +
    "                    <di-toggle-switch pr-toggle-switch-id=\"isInDebugMode\"\r" +
    "\n" +
    "                                      ng-model=\"isInDebugMode\" ng-change=\"processToggleDebugMode\"></di-toggle-switch>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <span i18n=\"_DebugSettingsEnabled_\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_AutoCareRequest_\"></legend>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"select-FullWidth upperAndLowerPadding\">\r" +
    "\n" +
    "                <div class=\"pull-right\">\r" +
    "\n" +
    "                    <di-toggle-switch pr-toggle-switch-id=\"autoCareRequestEnabled\"\r" +
    "\n" +
    "                                      ng-model=\"autoCareRequestEnabled\" ng-change=\"processToggleAutoCareRequest\"></di-toggle-switch>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <span i18n=\"_Enabled_\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"select-FullWidth\">\r" +
    "\n" +
    "                <form name=\"autoCareIntervalForm\">\r" +
    "\n" +
    "                    <div class=\"error\" ng-show=\"autoCareIntervalForm.$invalid && autoCareRequestEnabled\" i18n=\"_Invalid_\" />\r" +
    "\n" +
    "                    <label for=\"autoCareInterval\" i18n=\"_AutoCareRequestInterval_\"></label>\r" +
    "\n" +
    "                    <input name=\"autoCareInterval\" class=\"inputFullWidth\"\r" +
    "\n" +
    "                           required type=\"number\" min=\"0\"\r" +
    "\n" +
    "                           ng-disabled=\"!autoCareRequestEnabled\"\r" +
    "\n" +
    "                           ng-model=\"autoCareRequestInterval\"\r" +
    "\n" +
    "                           ng-change=\"setAutoCareRequestInterval()\" />\r" +
    "\n" +
    "                </form>                \r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/controllers/defineLanguage.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-header-first-line-localized=\"_FirstStartLang_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_Language_\" />\r" +
    "\n" +
    "            <div di-set-language />\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" type=\"button\" ng-click=\"next()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/forward-arrow-white_35x35.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                    <div i18n=\"_FirstStart_NextPage_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/common/controllers/defineUrl.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-header-first-line-localized=\"_FirstStartUrl_Title_\" ></header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_Url_\" ></legend>\r" +
    "\n" +
    "            <form name=\"urlForm\" novalidate>\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label i18n=\"_Settings_Host_\"></label>\r" +
    "\n" +
    "                    <div ng-show=\"urlForm.fUrl.$invalid && isSubmitted\">\r" +
    "\n" +
    "                        <span ng-show=\"urlForm.fUrl.$error.required\" i18n=\"_Settings_UrlRequired_\" class=\"error\"></span>\r" +
    "\n" +
    "                        <span ng-show=\"urlForm.fUrl.$error.url\" i18n=\"_Settings_UrlInvalidFormat_\" class=\"error\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <input name=\"fUrl\" class=\"input-FullWidth\" type=\"url\" i18n-placeholder=\"_FirstStartUrl_HostPlaceholder_\"\r" +
    "\n" +
    "                           required di-keyboard-helper-target ng-model=\"baseUrl.host\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label i18n=\"_Settings_Port_\"></label>\r" +
    "\n" +
    "                    <input class=\"input-FullWidth\" type=\"number\" i18n-placeholder=\"_FirstStartUrl_PortPlaceholder_\"\r" +
    "\n" +
    "                           di-keyboard-helper-target ng-model=\"baseUrl.port\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div>\r" +
    "\n" +
    "                    <label i18n=\"_Settings_Path_\"></label>\r" +
    "\n" +
    "                    <div ng-show=\"urlForm.fPath.$invalid && isSubmitted\">\r" +
    "\n" +
    "                        <span ng-show=\"urlForm.fPath.$error.required\" i18n=\"_Settings_PathRequired_\" class=\"error\"></span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <input name=\"fPath\" class=\"input-FullWidth\" type=\"text\" i18n-placeholder=\"_FirstStartUrl_PathPlaceholder_\"\r" +
    "\n" +
    "                           required di-keyboard-helper-target ng-model=\"baseUrl.path\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!--JvR: downside of this keyboardhelper is that it will create a whitespace of 200px which looks not that nice -->\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "        <div di-keyboard-helper ></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" type=\"button\" ng-click=\"next()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/forward-arrow-white_35x35.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                    <div i18n=\"_FirstStart_NextPage_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/controllers/homePage.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"false\" pr-home=\"false\" pr-header-first-line-localized=\"{{pushIsEnabled ? '_CareRequestDetail_Title_' : '_HomePage_Title_'}}\" ></header>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "        <div ng-switch=\"pushIsEnabled\">\r" +
    "\n" +
    "            <div ng-switch-when=\"true\">\r" +
    "\n" +
    "                <di-care-requests></di-care-requests>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div ng-switch-when=\"false\">\r" +
    "\n" +
    "                <di-todays-messages></di-todays-messages>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <footer class=\"subPageTab\">\r" +
    "\n" +
    "        <span class=\"subPageItem touchArea\" ng-if=\"settings.allowSearchSubscriberInResponder\" ng-click=\"navigate('searchSubscribers')\">\r" +
    "\n" +
    "            <button class=\"homeFooterButton imgCenter buttonTransparent\" type=\"button\">\r" +
    "\n" +
    "                <img class=\"smallImageSize\" src=\"../../shared/img/subscriber-white_72x72.png\" />\r" +
    "\n" +
    "                <div i18n=\"_HomePage_Search_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </span>\r" +
    "\n" +
    "        <span class=\"subPageItem touchArea\" ng-if=\"settings.allowAddSubscriberInResponder\" ng-click=\"navigate('newSubscriber/profile')\">\r" +
    "\n" +
    "            <button class=\"homeFooterButton imgCenter buttonTransparent\" type=\"button\">\r" +
    "\n" +
    "                <img class=\"smallImageSize\" src=\"../../shared/img/new-white_72x72.png\"/>\r" +
    "\n" +
    "                <div i18n=\"_HomePage_New_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </span>\r" +
    "\n" +
    "        <span class=\"subPageItem touchArea\" ng-click=\"navigate('messages')\">\r" +
    "\n" +
    "            <button class=\"homeFooterButton imgCenter buttonTransparent\" type=\"button\" >\r" +
    "\n" +
    "                <div style=\"position: relative\">\r" +
    "\n" +
    "                    <img class=\"smallImageSize\" src=\"../../shared/img/messages-white_72x72.png\"/>\r" +
    "\n" +
    "                    <div id=\"messageCountBadge\" ng-show=\"newMessageCount > 0\" class=\"badge badge-important\" ng-bind=\"newMessageCount\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <span i18n=\"_HomePage_Messages_\" />\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </span>\r" +
    "\n" +
    "        <span class=\"subPageItem touchArea\" ng-click=\"navigate('settings')\">\r" +
    "\n" +
    "            <button class=\"homeFooterButton imgCenter buttonTransparent\" type=\"button\">\r" +
    "\n" +
    "                <img class=\"smallImageSize\" src=\"../../shared/img/actions/Settings_white_128x128.png\"/>\r" +
    "\n" +
    "                <div i18n=\"_HomePage_Settings_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </span>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/controllers/listSelector.html',
    "<div class=\"page\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"{{title}}\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "        <input type=\"text\" i18n-placeholder=\"_TypeToFilter_\" autofocus class=\"contentPadding input-block-level\" ng-model=\"filterText\" />\r" +
    "\n" +
    "        <div class=\"list\" ng-if=\"item.Name\" \r" +
    "\n" +
    "             ng-repeat=\"item in (filteredList = (selectorOptions.dataSet | filter: { Name : ''} | filter:selectorOptions.filters \r" +
    "\n" +
    "                | filter:filterText) | limitTo: pageLimit)\">\r" +
    "\n" +
    "            <div class=\"imgInlineHeading \" ng-click=\"selectItem(item)\">\r" +
    "\n" +
    "                <h4 ng-bind=\"item.Name\"></h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-show=\"pageLimit < filteredList.length\"\r" +
    "\n" +
    "             ng-click=\"increasePageLimit()\"\r" +
    "\n" +
    "             i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "             class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/controllers/loadingScreen.html',
    "<div class=\"page loading\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"spinner\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <span class=\"loadingMessage\" i18n=\"{{loadingMessage}}\"></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('js/common/controllers/settings.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"currentUserRole === roles.caregiver\"\r" +
    "\n" +
    "            pr-about=\"true\" pr-header-first-line-localized=\"_Settings_Title_\"></header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_Language_\"></legend>\r" +
    "\n" +
    "            <div di-set-language></div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!--needsclick class is used here to prevent FastClick to be used on the select boxes.\r" +
    "\n" +
    "        the select boxes did not work when FastClick was enabled-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <fieldset ng-show=\"currentUserRole === roles.caregiver && (newSubscriberStatusIsEditable || newDeviceStatusIsEditable || deviceUnlinkStatusIsEditable)\">\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_Status_\"></legend>\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <div ng-show=\"newSubscriberStatusIsEditable\">\r" +
    "\n" +
    "                    <label i18n=\"_Settings_StatusDescription_\"></label>\r" +
    "\n" +
    "                    <div di-input-spinner-fullsize pr-is-loading-promise=\"subscriberStatussesPromise\">\r" +
    "\n" +
    "                        <select class=\"needsclick select-FullWidth\"\r" +
    "\n" +
    "                                ng-model=\"settings.status\"\r" +
    "\n" +
    "                                ng-options=\"status.Id as status.Name for status in statusses | filter: {DeviceRequired: false}\"\r" +
    "\n" +
    "                                ng-change=\"setStatus()\">\r" +
    "\n" +
    "                            <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-show=\"newDeviceStatusIsEditable\">\r" +
    "\n" +
    "                    <label i18n=\"_Settings_NewDeviceStatusDescription_\"></label>\r" +
    "\n" +
    "                    <div di-input-spinner-fullsize pr-is-loading-promise=\"deviceStatussesPromise\">\r" +
    "\n" +
    "                        <select class=\"needsclick select-FullWidth\"\r" +
    "\n" +
    "                                ng-model=\"settings.newDeviceStatus\"\r" +
    "\n" +
    "                                ng-options=\"status.Id as status.Name for status in newDeviceStatusses | filter: {ReadyForPlacement: false}\"\r" +
    "\n" +
    "                                ng-change=\"setDeviceStatus()\">\r" +
    "\n" +
    "                            <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-show=\"deviceUnlinkStatusIsEditable\">\r" +
    "\n" +
    "                    <label i18n=\"_Settings_NewDeviceDisconnectedStatusDescription_\"></label>\r" +
    "\n" +
    "                    <div di-input-spinner-fullsize pr-is-loading-promise=\"deviceStatussesPromise\">\r" +
    "\n" +
    "                        <select class=\"needsclick select-FullWidth\"\r" +
    "\n" +
    "                                ng-model=\"settings.deviceUnlinkStatus\"\r" +
    "\n" +
    "                                ng-options=\"status.Id as status.Name for status in newDeviceStatusses\"\r" +
    "\n" +
    "                                ng-change=\"setDeviceUnlinkStatus()\">\r" +
    "\n" +
    "                            <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "                        </select>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <fieldset ng-show=\"currentUserRole === roles.caregiver\">\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_PushNotifications_\"></legend>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"error\" ng-show=\"pushEnableError\" i18n=\"_Settings_PushTelIsRequired_\"></p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div di-input-spinner-fullsize pr-is-loading-promise=\"caregiverNumbersPromise\">\r" +
    "\n" +
    "                <select class=\"needsclick\"\r" +
    "\n" +
    "                        ng-disabled=\"isLoading() || pushSettings.pushEnabled\"\r" +
    "\n" +
    "                        ng-model=\"pushSettings.pushTelNumber\"\r" +
    "\n" +
    "                        ng-options=\"phoneNumber.Number as phoneNumber.Number for phoneNumber in caregiverPhoneNumbers\"\r" +
    "\n" +
    "                        ng-change=\"setPushTelNumber(pushSettings.pushTelNumber)\">\r" +
    "\n" +
    "                    <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "                </select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"select-FullWidth upperAndLowerPadding\">\r" +
    "\n" +
    "                <div class=\"pull-right\">\r" +
    "\n" +
    "                    <di-toggle-switch ng-disabled=\"isLoading()\" pr-toggle-switch-id=\"pushEnabled\"\r" +
    "\n" +
    "                                      ng-model=\"pushSettings.pushEnabled\" ng-change=\"processPushEnabled\"></di-toggle-switch>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <span i18n=\"_Settings_PushNotificationsEnabled_\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <fieldset ng-show=\"currentUserRole === roles.operator && platformIsValidForFacetime()\">\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_FaceTimeRequest_\"></legend>\r" +
    "\n" +
    "            <p i18n=\"_Settings_FaceTimeDescription_\"></p>\r" +
    "\n" +
    "            <p class=\"error\" ng-show=\"faceTimeError\" i18n=\"_Required_\"></p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <input id=\"inputFaceTimeId\" class=\"input-block-level\" type=\"text\" di-keyboard-helper-target\r" +
    "\n" +
    "                   ng-model=\"faceTimeSettings.faceTimeId\" ng-change=\"setFaceTimeId(faceTimeSettings.faceTimeId)\" i18n-placeholder=\"_Settings_FaceTimeId_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"select-FullWidth upperAndLowerPadding\">\r" +
    "\n" +
    "                <div class=\"pull-right\">\r" +
    "\n" +
    "                    <di-toggle-switch ng-disabled=\"isLoading()\" pr-toggle-switch-id=\"faceTimeEnabled\"\r" +
    "\n" +
    "                                      ng-model=\"faceTimeSettings.faceTimeEnabled\" ng-change=\"processFaceTimeEnabled\"></di-toggle-switch>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <span i18n=\"_Settings_EnableFaceTime_\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "            <legend class=\"textGreen\" i18n=\"_Settings_UserManagement_\"></legend>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div ng-show=\"currentUserRole === roles.caregiver\" class=\"contentPaddingExceptBottom\">\r" +
    "\n" +
    "                <button class=\"btn roundedBtn-large\" i18n=\"_Settings_ChangePassword_\" ng-click=\" navigateToChangePassword()\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"contentPaddingExceptBottom\">\r" +
    "\n" +
    "                <button class=\"btn roundedBtn-large\" i18n=\"_Settings_Logout_\" ng-click=\"logout()\"></button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/boolGlyphicon.html',
    "<i ng-class=\"isOkGlypicon ? 'icon-ok' : 'icon-remove'\"></i>"
  );


  $templateCache.put('js/common/directives/buttons/aboutbutton.html',
    "<button class=\"buttonTransparent\" type=\"button\" ng-click=\"goAbout()\">\r" +
    "\n" +
    "    <img src=\"../../shared/img/actions/AboutInfo_white_128x128.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "</button>\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/buttons/backbutton.html',
    "<button class=\"buttonTransparent\" type=\"button\" ng-click=\"goBack()\">\r" +
    "\n" +
    "    <img src=\"../../shared/img/actions/BackArrow_white_128x128.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "</button>"
  );


  $templateCache.put('js/common/directives/buttons/homebutton.html',
    "<button class=\"buttonTransparent\" type=\"button\" ng-click=\"goHome()\">\r" +
    "\n" +
    "    <img src=\"../../shared/img/umo-button_72x72.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "</button>"
  );


  $templateCache.put('js/common/directives/datePicker.html',
    "<input class=\"input-medium\" type=\"text\" i18n-placeholder=\"_NewSubscriberProfile_InputBirthdateHolder_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<button class=\"btn roundedBtn-medium\" type=\"button\" ng-click=\"resetDate()\" i18n=\"_NewSubscriberProfile_InputBirthdateReset_\" />\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/headerBanner.html',
    "<div class=\"headerContainer headerBanner\">\r" +
    "\n" +
    "    <div class=\"headerLeft\">\r" +
    "\n" +
    "        <div class=\"centerDiv touchArea touchAreaHeader\" ng-show=\"prBack\">\r" +
    "\n" +
    "            <div di-backbutton />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"headerMiddle text-center centerDiv\">\r" +
    "\n" +
    "        <div ng-bind=\"prHeaderFirstLine\" />\r" +
    "\n" +
    "        <div i18n=\"{{prHeaderFirstLineLocalized}}\" />\r" +
    "\n" +
    "        <div ng-bind=\"prHeaderSecondLine\" />\r" +
    "\n" +
    "        <div i18n=\"{{prHeaderSecondLineLocalized}}\" />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"headerRight\">\r" +
    "\n" +
    "        <div class=\"centerDiv touchArea touchAreaHeader\" ng-show=\"prHome\">\r" +
    "\n" +
    "            <div di-homebutton />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"centerDiv touchArea touchAreaHeader\" ng-show=\"prAbout\">\r" +
    "\n" +
    "            <div di-aboutbutton />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/homePage/careRequests.html',
    "<!--Care request switch current and history-->\r" +
    "\n" +
    "<nav class=\"subPageNavigation grayOutDisabled\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!--There may be no space between the different spans to evenly give 50% of the page to the apps-->\r" +
    "\n" +
    "    <span class=\"mediumContentPadding touchArea halfOfPage\" ng-click=\"showTodaysCareRequests()\" ng-disabled=\"showOnlyToday\">\r" +
    "\n" +
    "        <img src=\"../../shared/img/actions/CareReqCur_black_32x32.png\" class=\"x-smallImageSize\" />\r" +
    "\n" +
    "    </span><span class=\"mediumContentPadding touchArea halfOfPage\" ng-click=\"showPreviousCareRequests()\" ng-disabled=\"!showOnlyToday\">\r" +
    "\n" +
    "        <img src=\"../../shared/img/actions/CareReqHis_black_32x32.png\" class=\"x-smallImageSize\" />\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "</nav>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--Current care requests -->\r" +
    "\n" +
    "<div ng-switch=\"showOnlyToday\">\r" +
    "\n" +
    "    <div ng-switch-when=\"true\">\r" +
    "\n" +
    "        <div class=\"searchControls contentPadding\" ng-show=\"currentCareRequests.length == 0\">\r" +
    "\n" +
    "            <div class=\"textGray\" i18n=\"_Home_NoCareRequests_\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\" ng-repeat=\"row in currentCareRequests\">\r" +
    "\n" +
    "            <div class=\"media-body\" ng-click=\"toCareRequestDetail(row.SessionId)\">\r" +
    "\n" +
    "                <care-request-list-item pr-navigation-from-list-item-enabled=\"false\"\r" +
    "\n" +
    "                                        pr-care-request-item=\"row\"\r" +
    "\n" +
    "                                        pr-care-request-limited-reason=\"true\"\r" +
    "\n" +
    "                                        pr-show-speech-icon=\"true\"></care-request-list-item>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div ng-switch-when=\"false\">\r" +
    "\n" +
    "        <div class=\"searchControls contentPadding\" ng-show=\"previousCareRequests.length === 0\">\r" +
    "\n" +
    "            <div class=\"textGray\" i18n=\"_Home_NoCareRequestsHistory_\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\" ng-repeat=\"row in previousCareRequests\">\r" +
    "\n" +
    "            <div class=\"media-body\" ng-click=\"toCareRequestDetail(row.SessionId)\">\r" +
    "\n" +
    "                <care-request-list-item pr-navigation-from-list-item-enabled=\"false\"\r" +
    "\n" +
    "                                        pr-care-request-item=\"row\"\r" +
    "\n" +
    "                                        pr-care-request-limited-reason=\"true\"></care-request-list-item>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/homePage/todaysMessages.html',
    "<div class=\"searchControls\" ng-show=\"messagesViewModel.data.length == 0\">\r" +
    "\n" +
    "    <br />\r" +
    "\n" +
    "    <p class=\"textGray\" i18n=\"_HomePage_NoData_\" />\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"list\" ng-repeat=\"row in messagesViewModel.data\">\r" +
    "\n" +
    "    <div class=\"media-body\" ng-click=\"toDetailMessage($index)\">\r" +
    "\n" +
    "        <di-message-list-item pr-message-item=\"row\"></di-message-list-item>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div ng-show=\"messagesViewModel.data && messagesViewModel.hasNextPage\"\r" +
    "\n" +
    "     ng-click=\"loadMoreMessages()\"\r" +
    "\n" +
    "     i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "     class=\"contentPadding centerDiv\"></div>\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/inputSpinner.html',
    "<div class=\"spinnerInputContainer\">\r" +
    "\n" +
    "    <div ng-if=\"isSmallSpinnerLoading\" class=\"smallSpinner\"></div>\r" +
    "\n" +
    "    <fieldset class=\"input\" ng-disabled=\"isSmallSpinnerLoading\" ng-transclude></fieldset>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/common/directives/keyboardHelper/keyboardHelper.html',
    "<div style=\"height:200px;\" ng-show=\"inputFocus\" />"
  );


  $templateCache.put('js/common/directives/noteFooter.html',
    "<footer class=\"text-center\">\r" +
    "\n" +
    "    <div class=\"centerDiv\">\r" +
    "\n" +
    "        <div class=\"touchArea touchAreaWidth\" ng-if=\"allowAddNotesInResponder()\">\r" +
    "\n" +
    "            <button class=\"buttonTransparent\" type=\"button\" ng-click=\"newNote()\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/NewNote_white_128x128.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                <div i18n=\"_SubscriberPage_NewNote_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</footer>\r" +
    "\n"
  );


  $templateCache.put('js/common/directives/setLanguage.html',
    "<p class=\"error\" ng-show=\"langError\" i18n=\"_FirstStartLang_LangError_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "<label i18n=\"_Settings_Language_\"></label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<select class=\"needsclick select-FullWidth\"\r" +
    "\n" +
    "    required\r" +
    "\n" +
    "    ng-model=\"language\"\r" +
    "\n" +
    "    ng-options=\"lang.code as lang.value for lang in languages\"\r" +
    "\n" +
    "    ng-change=\"setLanguage()\">\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "</select>"
  );


  $templateCache.put('js/common/directives/toggleSwitch.html',
    "<div class=\"onoffswitch\">\r" +
    "\n" +
    "    <input type=\"checkbox\" ng-model=\"switchModel\" ng-change=\"modelChanged(switchModel)\"\r" +
    "\n" +
    "           name=\"{{toggleSwitchId}}\" class=\"onoffswitch-checkbox\" id=\"{{toggleSwitchId}}\">\r" +
    "\n" +
    "    <label class=\"onoffswitch-label\" for=\"{{toggleSwitchId}}\">\r" +
    "\n" +
    "        <span class=\"onoffswitch-inner\"></span>\r" +
    "\n" +
    "        <span class=\"onoffswitch-switch\"></span>\r" +
    "\n" +
    "    </label>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/messages/controllers/messages.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"_Messages_Title_\" ></header>\r" +
    "\n" +
    "   \r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "        <div class=\"searchControls\" ng-show=\"messagesViewModel.hasNoResults\">\r" +
    "\n" +
    "            <br />\r" +
    "\n" +
    "            <p class=\"textGray\" i18n=\"_Messages_NoData_\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\" ng-repeat=\"row in messagesViewModel.data\">\r" +
    "\n" +
    "            <div class=\"media-body\" ng-click=\"toDetailMessage($index)\">\r" +
    "\n" +
    "                <di-message-list-item pr-message-item=\"row\" pr-is-new=\"{{row.SortIndex > lastSeenMessage}}\"></di-message-list-item>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-show=\"messagesViewModel.data && messagesViewModel.hasNextPage\"\r" +
    "\n" +
    "             ng-click=\"loadMoreMessages()\"\r" +
    "\n" +
    "             i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "             class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" type=\"button\" ng-click=\"toNewMessage()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/messages-white_72x72.png\" style=\"width: 36px; height: 36px;\" />\r" +
    "\n" +
    "                    <div i18n=\"_NewMessage_Title_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/messages/controllers/messagesDetail.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" pr-header-first-line-localized=\"_MessagesDetail_Title_\"></header>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <h4 ng-bind=\"message.CreatedBy\" ></h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"textGray\">\r" +
    "\n" +
    "            <p class=\"messageSubject textWrappingBreakWord\" ng-bind=\"message.Subject\" ></p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <span i18n=\"_NewMessage_ValidToDate_\"></span>:\r" +
    "\n" +
    "            <br />\r" +
    "\n" +
    "            <span ng-bind-with-default=\"message.ValidPeriod.ToDate | MStoJSDateTime\" pr-default-localized-key=\"_Unknown_\"></span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"textBlue\" ng-bind=\"message.Content\" ></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" type=\"button\" ng-click=\"toNewMessage()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/messages-white_72x72.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                    <div i18n=\"_NewMessage_Title_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/messages/controllers/newMessage.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" pr-header-first-line-localized=\"_NewMessage_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding textGray\">\r" +
    "\n" +
    "        <form name=\"newMessageForm\" novalidate>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewMessage_Organization_\"></h4>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && newMessageForm.organization.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "            <select class=\"needsclick\" name=\"organization\" required ng-model=\"newMessage.organization\" ng-options=\"o.OriginalOrganisation as o.Name for o in organizations\">\r" +
    "\n" +
    "                <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewMessage_Subject_\"></h4>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && newMessageForm.subject.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "            <input class=\"inputFullWidth\" name=\"subject\" required type=\"text\" maxlength=\"{{maxTitleFieldLength}}\"\r" +
    "\n" +
    "                   ng-model=\"newMessage.subject\" di-keyboard-helper-target di-capitalize-first />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewMessage_Content_\"></h4>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && newMessageForm.content.$error.required\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "            <textarea class=\"inputFullWidth\" rows=\"3\" required name=\"content\" ng-model=\"newMessage.content\" ></textarea>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewMessage_ValidFromDate_\"></h4>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && !newMessage.fromDate\" i18n=\"_Required_\"></div>\r" +
    "\n" +
    "            <di-datepicker required\r" +
    "\n" +
    "                           pr-start-year-delta=\"-2\"\r" +
    "\n" +
    "                           pr-end-year-delta=\"10\"\r" +
    "\n" +
    "                           pr-show-time=\"true\"\r" +
    "\n" +
    "                           pr-binding=\"newMessage.fromDate\"\r" +
    "\n" +
    "                           class=\"textGray\"\r" +
    "\n" +
    "                           di-keyboard-helper-target\r" +
    "\n" +
    "                           ng-model=\"newMessage.fromDate\">\r" +
    "\n" +
    "            </di-datepicker>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewMessage_ValidToDate_\"></h4>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && !toDateIsValid()\" i18n=\"_NewMessage_ValidToDate_IncorrectWithFromDate_\"></div>\r" +
    "\n" +
    "            <di-datepicker pr-start-year-delta=\"0\"\r" +
    "\n" +
    "                           pr-end-year-delta=\"10\"\r" +
    "\n" +
    "                           pr-show-time=\"true\"\r" +
    "\n" +
    "                           pr-binding=\"newMessage.toDate\"\r" +
    "\n" +
    "                           class=\"textGray\"\r" +
    "\n" +
    "                           di-keyboard-helper-target>\r" +
    "\n" +
    "            </di-datepicker>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" ng-disabled=\"loading\" type=\"button\" ng-click=\"addNewMessage()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/actions/Approved_white_128x128.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                    <div i18n=\"_Accept_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/messages/directives/messageListItem.html',
    "<h4>\r" +
    "\n" +
    "    <div ng-show=\"isNew\" class=\"newItemCircle\"></div>\r" +
    "\n" +
    "    {{message.CreatedBy}}\r" +
    "\n" +
    "</h4>\r" +
    "\n" +
    "<div class=\"messageSubject textGray ellipseContent\">{{message.Subject}}</div>\r" +
    "\n" +
    "<img class=\"pull-right\" src=\"../../shared/img/arrow_right-gray_24x24.png\" />\r" +
    "\n" +
    "<div class=\"ellipseContent textBlue\">{{message.Content}}</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/newNote.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\"\r" +
    "\n" +
    "            pr-header-first-line=\"subscriberInfo.Identity.ShortName\" pr-header-second-line-localized=\"_NewNote_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding textGray\">\r" +
    "\n" +
    "        <form name=\"newNoteForm\" novalidate>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewNote_Subject_\" />\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && newNoteForm.subject.$invalid\" i18n=\"_Required_\" />\r" +
    "\n" +
    "            <input name=\"subject\" class=\"inputFullWidth\" maxlength=\"{{maxTitleFieldLength}}\" required type=\"text\" \r" +
    "\n" +
    "                   di-keyboard-helper-target di-capitalize-first ng-model=\"newNote.subject\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_NewNote_Content_\" />\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"submitted && newNoteForm.content.$invalid\" i18n=\"_Required_\" />\r" +
    "\n" +
    "            <textarea name=\"content\" required class=\"inputFullWidth\" rows=\"3\" ng-model=\"newNote.content\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"insertPhotoArea\">\r" +
    "\n" +
    "                <div class=\"touchArea\" ng-click=\"loading || setPicture()\">\r" +
    "\n" +
    "                    <span class=\"textGray\" i18n=\"_NewNote_Picture_\" />\r" +
    "\n" +
    "                    <img class=\"pull-right\" src=\"../../shared/img/camera-normal_72x72.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <img ng-show=\"newNote.photo\" ng-src=\"{{base64StringPrefix + newNote.photo}}\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <hr />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"upperAndLowerPadding\">\r" +
    "\n" +
    "                <di-toggle-switch pr-toggle-switch-id=\"crmNote\" class=\"pull-right\" ng-model=\"newNote.crmNote\"></di-toggle-switch>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <span i18n=\"_NewNote_CrmNote_\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"upperAndLowerPadding\">\r" +
    "\n" +
    "                <di-toggle-switch pr-toggle-switch-id=\"callCenterNote\" class=\"pull-right\" ng-model=\"newNote.callcenterNote\"></di-toggle-switch>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <span i18n=\"_NewNote_CallNote_\"></span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" ng-disabled=\"loading\" type=\"button\" ng-click=\"addNewNote()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/actions/Approved_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                    <div i18n=\"_Accept_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/newSubscriberProfile.html',
    "<div class=\"page\" vk-forceredraw>\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"_NewSubscriberProfile_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <form name=\"newSubscriberForm\" novalidate>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"surname\">\r" +
    "\n" +
    "                    <span i18n=\"_NewSubscriberProfile_InputSurname_\"></span> *\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <div class=\"error\" ng-show=\"newSubscriberForm.$submitted && !newSubscriber.surname\" i18n=\"_Required_\" />\r" +
    "\n" +
    "                <input id=\"surname\" ng-required class=\"input-block-level\" type=\"text\" di-keyboard-helper-target di-capitalize-first \r" +
    "\n" +
    "                       ng-model=\"newSubscriber.surname\" i18n-placeholder=\"_NewSubscriberProfile_InputSurnameHolder_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"inputInsertion\" i18n=\"_NewSubscriberProfile_InputInsertion_\"></label>\r" +
    "\n" +
    "                <input id=\"inputInsertion\" class=\"input-block-level\" type=\"text\" di-keyboard-helper-target ng-model=\"newSubscriber.insertion\" \r" +
    "\n" +
    "                       i18n-placeholder=\"_NewSubscriberProfile_InputInsertionHolder_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"inputFirstname\" i18n=\"_NewSubscriberProfile_InputFirstname_\"></label>\r" +
    "\n" +
    "                <input id=\"inputFirstname\" class=\"input-block-level\" type=\"text\" di-keyboard-helper-target di-capitalize-first \r" +
    "\n" +
    "                       ng-model=\"newSubscriber.firstName\" i18n-placeholder=\"_NewSubscriberProfile_InputFirstnameHolder_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"inputGender\" i18n=\"_NewSubscriberProfile_InputGender_\"></label>\r" +
    "\n" +
    "                <select class=\"needsclick\" id=\"inputGender\" ng-model=\"newSubscriber.gender\" \r" +
    "\n" +
    "                        ng-options=\"g.id as g.value for g in genderValues\">\r" +
    "\n" +
    "                    <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "                </select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"inputOrganization\">\r" +
    "\n" +
    "                    <span i18n=\"_NewSubscriberProfile_InputOrganization_\"></span> * \r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "                <div class=\"error\" ng-show=\"newSubscriberForm.$submitted && !newSubscriber.organizationId\" i18n=\"_Required_\" />\r" +
    "\n" +
    "                <select class=\"needsclick\" ng-required id=\"inputOrganization\" ng-model=\"newSubscriber.organizationId\"\r" +
    "\n" +
    "                        ng-options=\"o.Id as o.Name for o in organizations\">\r" +
    "\n" +
    "                    <option value=\"\" i18n=\"_PleaseSelect_\"></option>\r" +
    "\n" +
    "                </select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label i18n=\"_NewSubscriberProfile_InputBirthdate_\"></label>\r" +
    "\n" +
    "                <di-datepicker\r" +
    "\n" +
    "                    pr-show-time=\"false\"\r" +
    "\n" +
    "                    pr-start-year-delta=\"-150\"\r" +
    "\n" +
    "                    pr-end-year-delta=\"0\"\r" +
    "\n" +
    "                    pr-default-year-delta=\"-60\"\r" +
    "\n" +
    "                    pr-binding=\"newSubscriber.birthDate\"\r" +
    "\n" +
    "                    class=\"textGray\"\r" +
    "\n" +
    "                    di-keyboard-helper-target>\r" +
    "\n" +
    "                </di-datepicker>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"inputSocialnr\" i18n=\"_NewSubscriberProfile_InputServ.nr_\"></label>\r" +
    "\n" +
    "                <div class=\"error\" ng-show=\"newSubscriberForm.$submitted && newSubscriberForm.inputSocialnr.$invalid\" i18n=\"_NewSubscriberProfile_InputServ.nrValidation_\" />\r" +
    "\n" +
    "                <input id=\"inputSocialnr\" type=\"number\" di-keyboard-helper-target name=\"inputSocialnr\" ng-model=\"newSubscriber.serviceNr\" i18n-placeholder=\"_NewSubscriberProfile_InputServ.nrHolder_\" ng-pattern=\"\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <label for=\"inputRemark\" i18n=\"_NewSubscriberProfile_InputRemark_\"></label>\r" +
    "\n" +
    "                <textarea id=\"inputRemark\" class=\"input-block-level\" rows=\"5\" di-keyboard-helper-target ng-model=\"newSubscriber.remark\" i18n-placeholder=\"_NewSubscriberProfile_InputRemarkHolder_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div di-keyboard-helper />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" type=\"button\" ng-click=\"submitFirstPage()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/forward-arrow-white_35x35.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                    <div i18n=\"_NewSubscriberProfile_NextPage_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/newSubscriberResidence.html',
    "<div class=\"newSubscriberResidence page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"false\" pr-header-first-line-localized=\"_NewSubscriberResidence_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs contentPadding\">\r" +
    "\n" +
    "        <form name=\"newSubscriberForm\" novalidate>\r" +
    "\n" +
    "            <label for=\"street\">\r" +
    "\n" +
    "                <span i18n=\"_NewSubscriberResidence_InputStreet_\"></span> *\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"newSubscriberForm.$submitted && !newResidence.street\" i18n=\"_Required_\" />\r" +
    "\n" +
    "            <input id=\"street\" class=\"input-block-level\" type=\"text\" di-keyboard-helper-target di-capitalize-first \r" +
    "\n" +
    "                   ng-model=\"newResidence.street\" i18n-placeholder=\"_NewSubscriberResidence_InputStreetHolder_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <label for=\"houseNr\" i18n=\"_NewSubscriberResidence_InputHouseNr_\"></label>\r" +
    "\n" +
    "            <input id=\"houseNr\" type=\"text\" di-keyboard-helper-target ng-model=\"newResidence.houseNr\" \r" +
    "\n" +
    "                   i18n-placeholder=\"_NewSubscriberResidence_InputHouseNrHolder_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <label for=\"postcode\" i18n=\"_NewSubscriberResidence_InputPostcode_\"></label>\r" +
    "\n" +
    "            <input id=\"postcode\" type=\"text\" di-keyboard-helper-target ng-model=\"newResidence.postcode\" \r" +
    "\n" +
    "                   i18n-placeholder=\"_NewSubscriberResidence_InputPostcodeHolder_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <label for=\"city\">\r" +
    "\n" +
    "                <span i18n=\"_NewSubscriberResidence_InputCity_\"></span> *\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"newSubscriberForm.$submitted && !newResidence.city\" i18n=\"_Required_\" />\r" +
    "\n" +
    "            <button type=\"button\" id=\"city\" ng-click=\"selectCity()\" class=\"btn input-block-level\" \r" +
    "\n" +
    "                    ng-bind-with-default=\"newResidence.city.Name\" pr-default-localized-key=\"_ClickToSelect_\" ></button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <label for=\"region\" i18n=\"_NewSubscriberResidence_InputRegion_\"></label>\r" +
    "\n" +
    "            <button type=\"button\" id=\"region\" ng-click=\"selectRegion()\" class=\"btn input-block-level\" \r" +
    "\n" +
    "                    ng-bind-with-default=\"newResidence.region.Name\" pr-default-localized-key=\"_ClickToSelect_\" ></button>         \r" +
    "\n" +
    "\r" +
    "\n" +
    "            <label for=\"phone\">\r" +
    "\n" +
    "                <span i18n=\"_NewSubscriberResidence_InputPhone_\"></span> *\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "            <div class=\"error\" ng-show=\"newSubscriberForm.$submitted && !newResidence.phone\" i18n=\"_Required_\" />\r" +
    "\n" +
    "            <input id=\"phone\" type=\"tel\" di-keyboard-helper-target ng-model=\"newResidence.phone\" i18n-placeholder=\"_NewSubscriberResidence_InputPhoneHolder_\" />\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div di-keyboard-helper />\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer class=\"text-center\">\r" +
    "\n" +
    "        <div class=\"centerDiv\">\r" +
    "\n" +
    "            <div class=\"touchArea touchAreaWidth\">\r" +
    "\n" +
    "                <button class=\"buttonTransparent\" ng-disabled=\"loading\" type=\"button\" ng-click=\"addNewSubscriber()\">\r" +
    "\n" +
    "                    <img src=\"../../shared/img/actions/Approved_white_128x128.png\" width=\"36\" height=\"36\" />\r" +
    "\n" +
    "                    <div i18n=\"_NewSubscriberResidence_CreateSubscriber_\"></div>\r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/searchSubscriberResults.html',
    "<div class=\"searchSubscriberResult page\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" pr-header-first-line-localized=\"_SearchSubscribers_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"contentWithoutSubs\">\r" +
    "\n" +
    "        <div class=\"imageContainer\">\r" +
    "\n" +
    "            <img src=\"../../shared/img/subscriber-active_128x128.png\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"searchControls\">\r" +
    "\n" +
    "            <form class=\"form-search\" name=\"searchSubscriberForm\" novalidate ng-submit=\"searchSubscribers()\">\r" +
    "\n" +
    "                <div class=\"input-append\">\r" +
    "\n" +
    "                    <input name=\"searchInput\" class=\"span2 search-query\" type=\"text\" required \r" +
    "\n" +
    "                           di-keyboard-helper-target di-capitalize-first ng-minlength=\"3\" ng-model=\"searchText\" placeholder=\"Johnson\" />\r" +
    "\n" +
    "                    <button class=\"btn\" type=\"submit\" i18n=\"_SearchSubscribers_Search_\"></button>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <p class=\"error\" ng-show=\"submitted && searchSubscriberForm.searchInput.$invalid\" i18n=\"_SearchSubscribers_Required_\" />\r" +
    "\n" +
    "            </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"textGray\" ng-show=\"searchSubscribersViewModel.data.length == 0 && !loading && userHasPushedSearchButton\"\r" +
    "\n" +
    "               i18n=\"_SearchSubscriber_NoData_\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"centerBoxContentLeftAlign touchArea\"\r" +
    "\n" +
    "             ng-repeat=\"personViewed in recentViews track by personViewed.id\" \r" +
    "\n" +
    "             ng-show=\"!userHasPushedSearchButton\"\r" +
    "\n" +
    "             ng-click=\"navigateToRecentView(personViewed)\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <img src=\"../../shared/img/subscriber-normal_24x24.png\" />\r" +
    "\n" +
    "            <h5 class=\"textGray\" ng-bind=\"personViewed.name\" />\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\" ng-repeat=\"row in searchSubscribersViewModel.data\">\r" +
    "\n" +
    "            <div class=\"imgInlineHeading \" ng-click=\"selectSubscriber(row)\">\r" +
    "\n" +
    "                <h4>\r" +
    "\n" +
    "                    <img src=\"../../shared/img/subscriber-active_24x24.png\" />{{row.SubscriberName}}\r" +
    "\n" +
    "                </h4>\r" +
    "\n" +
    "                <img class=\"pull-right\" src=\"../../shared/img/arrow_right-gray_24x24.png\" />\r" +
    "\n" +
    "                <div class=\"messageSubject textGray\">{{row.StreetAddress}}</div>\r" +
    "\n" +
    "                <div class=\"messageSubject textGray\">{{row.Phonenumber}}</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div ng-show=\"searchSubscribersViewModel.data && searchSubscribersViewModel.hasNextPage\"\r" +
    "\n" +
    "             ng-click=\"getMore()\"\r" +
    "\n" +
    "             i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "             class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageAlarms.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" \r" +
    "\n" +
    "        pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageIncidents_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"4\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"subcontent\">\r" +
    "\n" +
    "            <div class=\"searchControls\" ng-show=\"alarmsViewModel.hasNoResults\">\r" +
    "\n" +
    "                <br />\r" +
    "\n" +
    "                <p class=\"textGray\" i18n=\"_SubscriberPageIncidents_NoData_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"row in alarmsViewModel.data\">\r" +
    "\n" +
    "                <div class=\"imgInlineHeading\">\r" +
    "\n" +
    "                    <h4><img src=\"../../shared/img/incidents-green_24x24.png\" />{{row.EventType}}<br />({{row.IncidentKind}})</h4>\r" +
    "\n" +
    "                    <!-- JvR: disabled till alarmdetail page is implemented-->\r" +
    "\n" +
    "                    <div>{{row.DeviceCode}}</div>\r" +
    "\n" +
    "                    <div>{{row.StartTime | MStoJSDateTime}}</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <div ng-show=\"alarmsViewModel.data && alarmsViewModel.hasNextPage\"\r" +
    "\n" +
    "                 ng-click=\"getMoreAlarms()\"\r" +
    "\n" +
    "                 i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "                 class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageCare.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" \r" +
    "\n" +
    "        pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageCare_Title_\" />\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"1\" />\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"subcontent\">\r" +
    "\n" +
    "            <div class=\"searchControls\" ng-show=\"caregiversViewModel.hasNoResults\">\r" +
    "\n" +
    "                <br />\r" +
    "\n" +
    "                <p class=\"textGray\" i18n=\"_SubscriberPageCare_NoData_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"row in caregiversViewModel.data\">\r" +
    "\n" +
    "                <div class=\"imgInlineHeading\">\r" +
    "\n" +
    "                    <h4><img class=\"x-smallImageSize\" \r" +
    "\n" +
    "                             ng-src=\"{{row.LinkingType | linkingTypeToImage}}\" />{{row.CaregiverName}} \r" +
    "\n" +
    "                        (<span i18n=\"{{row.CaregiverCategory | caregiverCategoryToText}}\"></span>)\r" +
    "\n" +
    "                    </h4>\r" +
    "\n" +
    "                    <div class=\"messageSubject textGray\">{{row.Address}}<br />{{row.City}}</div>\r" +
    "\n" +
    "                    <div ng-repeat=\"phoneNumber in row._phoneNumbers.Rows\">\r" +
    "\n" +
    "                        <a href=\"tel:{{phoneNumber.Number}}\" ng-bind=\"phoneNumber.Number\" />        \r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <div ng-show=\"caregiversViewModel.data && caregiversViewModel.hasNextPage\"\r" +
    "\n" +
    "                 ng-click=\"loadMoreCaregivers()\"\r" +
    "\n" +
    "                 i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "                 class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageDevices.html',
    "<div class=\"subscriberPageDevices page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\"\r" +
    "\n" +
    "            pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageDevices_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"3\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"subcontent\">\r" +
    "\n" +
    "            <div class=\"searchControls\" ng-show=\"allowChangeDeviceLinkInResponder && linkedDevicesViewModel.data && linkedDevicesViewModel.totalCount <= 1\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <form name=\"searchDevicesForm\" class=\"form-search\" novalidate ng-submit=\"searchDevices()\">\r" +
    "\n" +
    "                    <br />\r" +
    "\n" +
    "                    <div class=\"input-append\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <!--Depending on the amount of linked devices, another placeholder text has to be displayed-->\r" +
    "\n" +
    "                        <input class=\"span2 search-query\" name=\"searchInput\" type=\"text\"\r" +
    "\n" +
    "                               required ng-minlength=\"3\" ng-model=\"searchText\"\r" +
    "\n" +
    "                               i18n-placeholder=\"{{(linkedDevicesViewModel.totalCount == 0) ? '_SubscriberPageDevices_Link_' : '_SubscriberPageDevices_LinknReplace_' }}\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <button class=\"btn\" type=\"submit\" i18n=\"_SearchDevice_Search_\"></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                    <p class=\"error\" ng-show=\"submitted && searchDevicesForm.searchInput.$invalid\" i18n=\"_SearchDevice_Required_\" />\r" +
    "\n" +
    "                </form>\r" +
    "\n" +
    "                <div ng-show=\"(linkedDevicesViewModel.hasNoResults && !searchedDevicesViewModel.data) || searchedDevicesViewModel.hasNoResults\">\r" +
    "\n" +
    "                    <br />\r" +
    "\n" +
    "                    <div ng-hide=\"isLoading()\" class=\"textGray\" i18n=\"_SubscriberPageDevices_NoData_\"></div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <div class=\"list\" ng-repeat=\"row in linkedDevicesViewModel.data\" ng-show=\"!searchedDevicesViewModel.data\">\r" +
    "\n" +
    "                    <div class=\"imgInlineHeading\">\r" +
    "\n" +
    "                        <h4>\r" +
    "\n" +
    "                            <img ng-src=\"{{row.LinkingOfDevice | linkingTypeToImage}}\" />{{row.Code}}\r" +
    "\n" +
    "                        </h4>\r" +
    "\n" +
    "                        <div class=\"messageSubject textGray\">{{row.SerialNumber}}</div>\r" +
    "\n" +
    "                        <div class=\"textGray\">{{row.Type}}</div>\r" +
    "\n" +
    "                        <div class=\"textGray\">{{row.State}}</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <div class=\"list\" ng-repeat=\"row in searchedDevicesViewModel.data\" ng-show=\"searchedDevicesViewModel.data\">\r" +
    "\n" +
    "                    <div class=\"imgInlineHeading\">\r" +
    "\n" +
    "                        <h4>\r" +
    "\n" +
    "                            <img ng-src=\"{{row.LinkingOfDevice | linkingTypeToImage}}\" />{{row.Code}}\r" +
    "\n" +
    "                        </h4>\r" +
    "\n" +
    "                        <div class=\"messageSubject textGray\">{{row.SerialNumber}}</div>\r" +
    "\n" +
    "                        <img class=\"pull-right x-smallImageSize\" src=\"../../shared/img/actions/Link_black_64x64.png\" ng-click=\"linkDevice(row.Id)\" alt=\"link\" />\r" +
    "\n" +
    "                        <div class=\"textGray\">{{row.Type}}</div>\r" +
    "\n" +
    "                        <div class=\"textGray\">{{row.State}}</div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-show=\"searchedDevicesViewModel.data && searchedDevicesViewModel.hasNextPage\"\r" +
    "\n" +
    "                     ng-click=\"searchMoreDevices()\"\r" +
    "\n" +
    "                     i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "                     class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageFrame.html',
    "<div class=\"subscriberPageMeds page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\"\r" +
    "\n" +
    "            pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageMeds_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <iframe class=\"content\" onload=\"frameIsLoaded()\" ng-src=\"{{trustSrc(iframeSource)}}\"></iframe>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageMap.html',
    "<div class=\"subscriberPageMap page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" \r" +
    "\n" +
    "        pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageMap_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"5\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div ng-hide=\"mapIsUnusable\" class=\"subcontent\" ui-map=\"myMap\" ui-options=\"mapOptions\" />\r" +
    "\n" +
    "        <div ng-show=\"mapIsUnusable\" class=\"subcontent\">\r" +
    "\n" +
    "            <div class=\"contentPadding centerDiv\" i18n=\"{{pageMessage}}\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <footer class=\"text-center\"> \r" +
    "\n" +
    "        <div class=\"centerDiv spaceBetweenElements\">\r" +
    "\n" +
    "            <button class=\"buttonTransparent touchArea\" type=\"button\" ng-disabled=\"isLoading()\" ng-click=\"goToExternalNavigation()\">\r" +
    "\n" +
    "                <img src=\"../../shared/img/actions/Navigate_white_128x128.png\" class=\"smallImageSize\" />\r" +
    "\n" +
    "                <div i18n=\"_SubscriberPageMap_Navigate_\"></div>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </footer>  \r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageMeds.html',
    "<div class=\"subscriberPageMeds page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" \r" +
    "\n" +
    "        pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageMeds_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"2\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"subcontent contentPadding\">\r" +
    "\n" +
    "            <fieldset>\r" +
    "\n" +
    "                <legend class=\"textGreen\" i18n=\"_SubscriberPageMeds_Medical_\" />\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                <div ng-show=\"medicalInfo.Rows.length == 0\">\r" +
    "\n" +
    "                    <p class=\"textGray\" i18n=\"_SubscriberPageMeds_MedicalNoData_\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-repeat=\"row in medicalInfo.Rows\">\r" +
    "\n" +
    "                    <h5>{{row.MedicalCondition.Name}}</h5>\r" +
    "\n" +
    "                    <span class=\"textGray\">{{row.MedicalConditionValue.Name}} ({{row.MedicalPriority.Name}})</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <fieldset>\r" +
    "\n" +
    "                <legend class=\"textGreen\" i18n=\"_SubscriberPageMeds_Medication_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-show=\"medicationInfo.Rows.length == 0\">\r" +
    "\n" +
    "                    <p class=\"textGray\" i18n=\"_SubscriberPageMeds_MedicationNoData_\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-repeat=\"row in medicationInfo.Rows\">\r" +
    "\n" +
    "                    <h5>{{row.Medicine.Name}}</h5>\r" +
    "\n" +
    "                    <span class=\"textGray\">({{row.MedicalPriority.Name}})</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </fieldset>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <fieldset ng-show=\"teleMedicine.length > 0\">\r" +
    "\n" +
    "                <legend class=\"textGreen\" >Tele Medicine</legend>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-repeat=\"row in teleMedicine\">\r" +
    "\n" +
    "                    <h5>Medical data {{$index + 1}}</h5>\r" +
    "\n" +
    "                    <span ng-click=\"navigateToTelemedicine($index)\" class=\"textGray\">({{row}})</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </fieldset>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageNoteDetail.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner \r" +
    "\n" +
    "            pr-back=\"true\" pr-home=\"true\"\r" +
    "\n" +
    "            pr-header-first-line=\"profileInfo.Identity.ShortName\" \r" +
    "\n" +
    "            pr-header-second-line-localized=\"_SubscriberPageNotes_Title_\" >        \r" +
    "\n" +
    "    </header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"0\" ></nav>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"subcontent contentPadding\">\r" +
    "\n" +
    "            <div ng-show=\"!isLoading\" class=\"pull-right leftWhiteSpace textGray\">\r" +
    "\n" +
    "                <div class=\"textSmall\" ng-bind=\"noteDetailInfo.CreatedDate | MStoJSDateTime\"></div>\r" +
    "\n" +
    "                <div class=\"textSmall\">\r" +
    "\n" +
    "                    <span i18n=\"_SubscriberPageNotes_CRMCheck_\"></span>\r" +
    "\n" +
    "                    <bool-glyphicon bool=\"noteDetailInfo.IsEditDataRequired\"></bool-glyphicon>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"textSmall\">\r" +
    "\n" +
    "                    <span i18n=\"_SubscriberPageNotes_AlarmCheck_\"></span>\r" +
    "\n" +
    "                    <bool-glyphicon bool=\"noteDetailInfo.IsPopUp\"></bool-glyphicon>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"contentWrapping textWrappingBreakWord\" ng-bind=\"noteDetailInfo.Subject\"></h4>\r" +
    "\n" +
    "            <div class=\"textGray\">\r" +
    "\n" +
    "                <p class=\"textWrappingBreakWord\" ng-bind-html=\"trustAsHtml(noteDetailInfo.Content)\" />\r" +
    "\n" +
    "                <span>{{noteDetailInfo.DefaultRemark}}</span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div>\r" +
    "\n" +
    "                <img ng-src=\"{{imageUrl}}\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer>\r" +
    "\n" +
    "        <di-note-footer></di-note-footer>\r" +
    "\n" +
    "    </footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageNotes.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" pr-home=\"true\" \r" +
    "\n" +
    "        pr-header-first-line=\"profileInfo.Identity.ShortName\" pr-header-second-line-localized=\"_SubscriberPageNotes_Title_\" ></header>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"0\" ></nav>\r" +
    "\n" +
    "           \r" +
    "\n" +
    "        <div class=\"subcontent\">\r" +
    "\n" +
    "            <div class=\"searchControls\" ng-show=\"notesViewModel.hasNoResults\">\r" +
    "\n" +
    "                <br />\r" +
    "\n" +
    "                <p class=\"textGray\" i18n=\"_SubscriberPageNotes_NoData_\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"list\" ng-repeat=\"row in notesViewModel.data\">\r" +
    "\n" +
    "                <div ng-click=\"navigateToNoteDetail(row.Id)\">\r" +
    "\n" +
    "                    <div class=\"pull-right leftWhiteSpace textGray\">\r" +
    "\n" +
    "                        <div class=\"textSmall\">\r" +
    "\n" +
    "                            <span class=\"\">{{row.CreatedDate | MStoJSDate}}</span>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"textSmall\">\r" +
    "\n" +
    "                            <span i18n=\"_SubscriberPageNotes_CRMCheck_\"></span>\r" +
    "\n" +
    "                            <bool-glyphicon bool=\"row.IsEditDataRequired\"></bool-glyphicon>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                        <div class=\"textSmall\">\r" +
    "\n" +
    "                            <span i18n=\"_SubscriberPageNotes_AlarmCheck_\"></span>\r" +
    "\n" +
    "                            <bool-glyphicon bool=\"row.IsPopUp\"></bool-glyphicon>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h4>\r" +
    "\n" +
    "                        <p class=\"ellipseContent\" ng-bind=\"row.Subject\"></p>\r" +
    "\n" +
    "                        <img ng-src=\"../../shared/img/camera-normal_72x72.png\" class=\"x-smallImageSize\" ng-show=\"row.HasFileAttached\" />\r" +
    "\n" +
    "                    </h4>\r" +
    "\n" +
    "                    <div class=\"textGray\">\r" +
    "\n" +
    "                        <p class=\"onlyShowFirstElement\" ng-bind-html=\"trustAsHtml(row.Content)\" />\r" +
    "\n" +
    "                        <span>{{row.DefaultRemark}}</span>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <div ng-show=\"notesViewModel.data && notesViewModel.hasNextPage\"\r" +
    "\n" +
    "                 ng-click=\"loadMoreNotes()\"\r" +
    "\n" +
    "                 i18n=\"_ClickToLoadMore_\"\r" +
    "\n" +
    "                 class=\"contentPadding centerDiv\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer><di-note-footer></di-note-footer></footer>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/subscriber/controllers/subscriberPageProfile.html',
    "<div class=\"page\">\r" +
    "\n" +
    "    <header di-header-banner pr-back=\"true\" \r" +
    "\n" +
    "        pr-home=\"true\" \r" +
    "\n" +
    "        pr-header-first-line=\"profileInfo.Identity.ShortName\" \r" +
    "\n" +
    "        pr-header-second-line-localized=\"_SubscriberPageProfile_Title_\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"content\">\r" +
    "\n" +
    "        <nav di-subpagetab pr-header-index=\"0\" />\r" +
    "\n" +
    "        <div class=\"subcontent contentPadding\">\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_SubscriberPageProfile_Subscriber_\" />\r" +
    "\n" +
    "            <table class=\"table\">\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_BirthDate_\" />\r" +
    "\n" +
    "                    <td ng-bind-with-default=\"profileInfo.Identity.BirthDate | MStoJSDate\" pr-default-localized-key=\"_Unknown_\" />                       \r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_ClientNr_\" />\r" +
    "\n" +
    "                    <td ng-bind-with-default=\"profileInfo.SubscriptionNumber\" pr-default-localized-key=\"_Unknown_\"/>                    \r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>                    \r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_Status_\" />\r" +
    "\n" +
    "                    <td ng-bind-with-default=\"profileInfo.State.Name\" pr-default-localized-key=\"_Unknown_\"/>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_PhoneNr_\" />\r" +
    "\n" +
    "                    <td ng-show=\"subscriberPhoneNumbers.TotalCount != 0\">\r" +
    "\n" +
    "                        <div ng-repeat=\"phoneNumber in subscriberPhoneNumbers.Rows\">\r" +
    "\n" +
    "                            <a href=\"tel:{{phoneNumber.Number}}\" ng-bind=\"phoneNumber.Number\" />\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </td>                    \r" +
    "\n" +
    "                    <td ng-show=\"subscriberPhoneNumbers.TotalCount == 0\" i18n=\"_Unknown_\" />\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "            </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_SubscriberPageProfile_Residence_\" />\r" +
    "\n" +
    "            <table class=\"table\">\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_Address_\" />\r" +
    "\n" +
    "                    <td ng-bind-with-default=\"residenceInfo.StreetAddress.ShortAddress\" pr-default-localized-key=\"_Unknown_\"/>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_PostalCode_\" />\r" +
    "\n" +
    "                    <td ng-bind-with-default=\"residenceInfo.StreetAddress.PostalCode\" pr-default-localized-key=\"_Unknown_\"/>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_KeyCode_\" />\r" +
    "\n" +
    "                    <td ng-bind-with-default=\"residenceInfo.DefaultEntrance.KeyCode\" pr-default-localized-key=\"_Unknown_\"/>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"item\" i18n=\"_SubscriberPageProfile_PhoneNr_\" />\r" +
    "\n" +
    "                    <td ng-show=\"residenceInfo.DefaultPhoneNumber\"><a href=\"tel:{{residenceInfo.DefaultPhoneNumber}}\" ng-bind=\"residenceInfo.DefaultPhoneNumber\" /></td>\r" +
    "\n" +
    "                    <td ng-show=\"!residenceInfo.DefaultPhoneNumber\" i18n=\"_Unknown_\" />\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "            </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <h4 class=\"textGreen\" i18n=\"_SubscriberPageProfile_Notes_\" />\r" +
    "\n" +
    "            <div class=\"touchArea notesTouchArea\" ng-click=\"toNotes()\">\r" +
    "\n" +
    "                <span ng-bind=\"notesInfo.TotalCount\" />\r" +
    "\n" +
    "                <span class=\"textGray\" i18n=\"_SubscriberPageProfile_NoteCount_\" />\r" +
    "\n" +
    "                <img id=\"toNotes\" class=\"pull-right\" src=\"../../shared/img/arrow_right-gray_24x24.png\" />\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <footer><di-note-footer></di-note-footer></footer>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('js/subscriber/directives/subpagetab.html',
    "<div class=\"subPageTab\">\r" +
    "\n" +
    "    <span class=\"subPageItem touchArea subscriberMenuItemMargin\" ng-click=\"navigate(page.url)\" ng-repeat=\"page in pages\">\r" +
    "\n" +
    "        <img class=\"imgCenter\" ng-src=\"{{isPageActive(page.url) && page.active || page.image}}\" width=\"30\" height=\"30\" />\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
