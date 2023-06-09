// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCheckAppid = require('../../../app/middleware/check_appid');
import ExportCheckBindPhone = require('../../../app/middleware/check_bind_phone');
import ExportCheckPlatformAuth = require('../../../app/middleware/check_platform_auth');
import ExportCheckSchool = require('../../../app/middleware/check_school');
import ExportCheckStaffAuth = require('../../../app/middleware/check_staff_auth');
import ExportErrorHandler = require('../../../app/middleware/error_handler');
import ExportGetCurrentUser = require('../../../app/middleware/get_current_user');
import ExportGetCurrentUserAuth = require('../../../app/middleware/get_current_user_auth');
import ExportIsLogin = require('../../../app/middleware/is_login');

declare module 'egg' {
  interface IMiddleware {
    checkAppid: typeof ExportCheckAppid;
    checkBindPhone: typeof ExportCheckBindPhone;
    checkPlatformAuth: typeof ExportCheckPlatformAuth;
    checkSchool: typeof ExportCheckSchool;
    checkStaffAuth: typeof ExportCheckStaffAuth;
    errorHandler: typeof ExportErrorHandler;
    getCurrentUser: typeof ExportGetCurrentUser;
    getCurrentUserAuth: typeof ExportGetCurrentUserAuth;
    isLogin: typeof ExportIsLogin;
  }
}
