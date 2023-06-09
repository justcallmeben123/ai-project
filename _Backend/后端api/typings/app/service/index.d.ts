// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAccess = require('../../../app/service/access');
import ExportAlisms = require('../../../app/service/alisms');
import ExportBase = require('../../../app/service/base');
import ExportBbs = require('../../../app/service/bbs');
import ExportBook = require('../../../app/service/book');
import ExportCache = require('../../../app/service/cache');
import ExportCash = require('../../../app/service/cash');
import ExportColumn = require('../../../app/service/column');
import ExportCommon = require('../../../app/service/common');
import ExportCourse = require('../../../app/service/course');
import ExportFlashsale = require('../../../app/service/flashsale');
import ExportGroup = require('../../../app/service/group');
import ExportGroupWork = require('../../../app/service/group_work');
import ExportLive = require('../../../app/service/live');
import ExportOrder = require('../../../app/service/order');
import ExportPlatformstaff = require('../../../app/service/platformstaff');
import ExportQuestion = require('../../../app/service/question');
import ExportQueue = require('../../../app/service/queue');
import ExportRole = require('../../../app/service/role');
import ExportSchool = require('../../../app/service/school');
import ExportSchoolstaff = require('../../../app/service/schoolstaff');
import ExportUser = require('../../../app/service/user');
import ExportUserCoupon = require('../../../app/service/user_coupon');

declare module 'egg' {
  interface IService {
    access: AutoInstanceType<typeof ExportAccess>;
    alisms: AutoInstanceType<typeof ExportAlisms>;
    base: AutoInstanceType<typeof ExportBase>;
    bbs: AutoInstanceType<typeof ExportBbs>;
    book: AutoInstanceType<typeof ExportBook>;
    cache: AutoInstanceType<typeof ExportCache>;
    cash: AutoInstanceType<typeof ExportCash>;
    column: AutoInstanceType<typeof ExportColumn>;
    common: AutoInstanceType<typeof ExportCommon>;
    course: AutoInstanceType<typeof ExportCourse>;
    flashsale: AutoInstanceType<typeof ExportFlashsale>;
    group: AutoInstanceType<typeof ExportGroup>;
    groupWork: AutoInstanceType<typeof ExportGroupWork>;
    live: AutoInstanceType<typeof ExportLive>;
    order: AutoInstanceType<typeof ExportOrder>;
    platformstaff: AutoInstanceType<typeof ExportPlatformstaff>;
    question: AutoInstanceType<typeof ExportQuestion>;
    queue: AutoInstanceType<typeof ExportQueue>;
    role: AutoInstanceType<typeof ExportRole>;
    school: AutoInstanceType<typeof ExportSchool>;
    schoolstaff: AutoInstanceType<typeof ExportSchoolstaff>;
    user: AutoInstanceType<typeof ExportUser>;
    userCoupon: AutoInstanceType<typeof ExportUserCoupon>;
  }
}
