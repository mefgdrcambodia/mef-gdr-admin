// Summary
import SummaryIndex from "../page/dasboard/summary/chart/SummaryIndex.component";
import ActivityLogIndex from "../page/dasboard/summary/activity_log/Index.component";

// User
import AccountForm from "../page/dasboard/user/account/Form.component";
import AccountIndex from "../page/dasboard/user/account/Index.component";
import GroupIndex from "../page/dasboard/user/group/Index.component";
import GroupForm from "../page/dasboard/user/group/Form.component";

// Account
import MyAccountIndex from "../page/dasboard/account/Index.component";

// System
import VersionLog_Form from "../page/dasboard/system/version_log/VersionLog_Form.component";
import VersionLog_Index from "../page/dasboard/system/version_log/VersionLog_Index.component";

// Website | Header and Footer and Banner
import FooterIndex from "../page/dasboard/website_news/Footer.component";
import HeaderIndex from "../page/dasboard/website_news/Header.component";
import BannerPage from "../page/dasboard/website_news/Banner.component";

// Message
import MessageIndex from "../page/dasboard/about_gs/message.component";
import RoleAndResponsibilityIndex from "../page/dasboard/about_gs/role_and_responsiblitiy.component";
import ManagementStructure from "../page/dasboard/about_gs/management_structure";

import FormSpeech from "../page/dasboard/about_gs/speech/form_speech.component";
import IndexSpeech from "../page/dasboard/about_gs/speech/index_speech.component";

// Event
import FormNews from "../page/dasboard/event/news/form_new.component";
import FormIndex from "../page/dasboard/event/news/index_new.component";
import LegalForm from "../page/dasboard/event/legal/legal_form.component";
import LegalIndex from "../page/dasboard/event/legal/legal_index.component";

import IndexImageAlbum from "../page/dasboard/event/image_album/index_image_album.component";
import FormImageAlbum from "../page/dasboard/event/image_album/form_image_album.component";

import FormVideoAlbum from "../page/dasboard/event/video_album/form_video_album.component";
import IndexVideoAlbum from "../page/dasboard/event/video_album/index_video_album.component";

//Report
import IndexReport from "../page/dasboard/data_report/report/index_report.component";
import FormReport from "../page/dasboard/data_report/report/form_report.component";

// Department
import { GoWorkflow } from "react-icons/go";
import { GiNewspaper } from "react-icons/gi";
import { MdGroupWork } from "react-icons/md";
import FromDepartment_General from "../page/dasboard/dapartment/department_general/from_department_general.component";
import IndexDepartment_General from "../page/dasboard/dapartment/department_general/index_department_general.component";
import FromDepartment_ManageData from "../page/dasboard/dapartment/department_manage_data/form_department_manage_data.component";
import IndexDepartment_ManageData from "../page/dasboard/dapartment/department_manage_data/index_department_manage_data.component";
import FromDepartment_Resttlement_One from "../page/dasboard/dapartment/department_resttlement_1/form_department_resttlement_one.component";
import IndexDepartment_Resttlement_One from "../page/dasboard/dapartment/department_resttlement_1/index_department_resttlement_one.component";
import FromDepartment_Resttlement_Two from "../page/dasboard/dapartment/department_resttlement_2/form_department_resttlement_two.component";
import IndexDepartment_Resttlement_Two from "../page/dasboard/dapartment/department_resttlement_2/index_department_resttlement_two.component";
import FromDepartment_Resttlement_Three from "../page/dasboard/dapartment/department_resttlement_3/form_department_resttlement_three.component";
import IndexDepartment_Resttlement_Three from "../page/dasboard/dapartment/department_resttlement_3/index_department_resttlement_two.component";
//Icon

import { MdOutlinePivotTableChart } from "react-icons/md";
import { RiSlideshowView } from "react-icons/ri";
import { LuSpeech } from "react-icons/lu";
import { FaChartGantt } from "react-icons/fa6";
import { FaChartBar } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { CiVideoOn } from "react-icons/ci";
import { VscSymbolStructure } from "react-icons/vsc";
import { FaRegAddressBook } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineNewspaper } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { AiOutlineInsertRowBelow } from "react-icons/ai";
import { RxActivityLog } from "react-icons/rx";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaBook } from "react-icons/fa6";
import { MdAccountBalance } from "react-icons/md";
import { BsWindowStack } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { BiSolidReport } from "react-icons/bi";
import { MdAccountCircle } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { IoBarChartSharp } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { MdOutlineAccountTree } from "react-icons/md";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { MdNoteAlt } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { GrSystem } from "react-icons/gr";
import { FaDatabase } from "react-icons/fa6";
import { LuLogs } from "react-icons/lu";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { HiMiniDocumentText } from "react-icons/hi2";
//Script
import Auth from "../util/auth";
class RouteScript {
  constructor(prop) {
    this.prop = prop;
  }

  route() {
    const auth = new Auth();
    const user = auth.getClientLogin()?.data;
    const userRole = {
      id_admin: "687dc2df144731e0efc41a35",
      id_noter: "68882da272f7b68ef2056dd2",
      is_super_admin: auth.getClientLogin()?.data?.is_super_admin,
    };

    // console.log(this.prop?.auth);
    return {
      // ផ្ទាំងទិន្នន័យ
      ...this.route_Summary(auth, userRole, user),

      // about អគ្គ
      ...this.route_GS(auth, userRole, user),

      // about Department
      ...this.route_Department(auth, userRole, user),

      // Event and News
      ...this.route_Events(auth, userRole, user),

      // បណ្តុំឯកសារ
      ...this.route_DocumentCollection(auth, userRole, user),

      // Report
      ...this.route_Report(auth, userRole, user),

      // គណនី
      ...this.route_MyAccount(auth, userRole, user),

      // Website
      ...this.route_WebsiteNew(auth, userRole, user),

      // គ្រប់គ្រងកម្មវិធី
      ...this.route_User(auth, userRole, user),

      // // ប្រ័ពន្ធ
      // ...this.route_System(auth, userRole, user),
    };
  }

  checkPermission(isSuperAdmin, loginGroupId, userRole) {
    if (isSuperAdmin) {
      return true;
    } else {
      if (loginGroupId == userRole?.id_admin) {
        return true;
      } else {
        return false;
      }
    }
  }

  //==================================//
  // Route Statement
  route_Department(auth, userRole, user) {
    var status = {
      depement_general_index: true,
      depement_resttlement_one_index: true,
      depement_resttlement_two_index: true,
      depement_resttlement_three_index: true,
      depement_manage_data_index: true,
    };

    return {
      depement_parent: {
        hidden_menu: false,
        status: status,
        icon: <MdOutlinePivotTableChart />,
        document: "department",
        title: "នាយកដ្ឋាន",
        breadcurmb: [],
      },

      depement_general_index: {
        status: status.depement_general_index,
        document: "department",
        url: "/admin/about-gs/department-general",
        title: "នា. កិច្ចការទូទៅ",
        component: <IndexDepartment_General auth={auth} />,
        icon: <GoWorkflow />,
        breadcurmb: [
          {
            name: "នាយដ្ឋាន",
            path: "/admin/about-gs/department-general",
          },
          {
            name: "នាយកដ្ឋានកិច្ចការទូទៅ",
            path: "/admin/about-gs/department-general",
          },
        ],
      },

      depement_resttlement_one_index: {
        status: status.depement_resttlement_one_index,
        document: "department",
        url: "/admin/about-gs/department-resttlement_one",
        title: "នា. ផលប៉ះពាល់ទី១",
        component: <IndexDepartment_Resttlement_One auth={auth} />,
        icon: <GoWorkflow />,
        breadcurmb: [
          {
            name: "នាយដ្ឋាន",
            path: "/admin/about-gs/department-resttlement_one",
          },
          {
            name: "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ១",
            path: "/admin/about-gs/department-resttlement_one",
          },
        ],
      },

      depement_resttlement_two_index: {
        status: status.depement_resttlement_two_index,
        document: "department",
        url: "/admin/about-gs/department-resttlement_two",
        title: "នា. ផលប៉ះពាល់ទី២",
        component: <IndexDepartment_Resttlement_Two auth={auth} />,
        icon: <GoWorkflow />,
        breadcurmb: [
          {
            name: "នាយដ្ឋាន",
            path: "/admin/about-gs/department-resttlement_two",
          },
          {
            name: "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ២",
            path: "/admin/about-gs/department-resttlement_two",
          },
        ],
      },

      depement_resttlement_three_index: {
        status: status.depement_resttlement_three_index,
        document: "department",
        url: "/admin/about-gs/department-resttlement_three",
        title: "នា. ផលប៉ះពាល់ទី៣",
        component: <IndexDepartment_Resttlement_Three auth={auth} />,
        icon: <GoWorkflow />,
        breadcurmb: [
          {
            name: "នាយដ្ឋាន",
            path: "/admin/about-gs/department-resttlement_three",
          },
          {
            name: "នាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ទី ៣",
            path: "/admin/about-gs/department-resttlement_three",
          },
        ],
      },

      depement_manage_data_index: {
        status: status.depement_manage_data_index,
        document: "department",
        url: "/admin/about-gs/depement-manage-data",
        title: "នា. ផ្ទៃក្នុង​ &គ. ទិន្នន័យ",
        component: <IndexDepartment_ManageData auth={auth} />,
        icon: <GoWorkflow />,
        breadcurmb: [
          {
            name: "នាយដ្ឋាន",
            path: "/admin/about-gs/depement-manage-data",
          },
          {
            name: "នាយកដ្ឋានត្រួតពិនិត្យផ្ទៃក្នុង និងគ្រប់គ្រងទិន្នន័យ",
            path: "/admin/about-gs/depement-manage-data",
          },
        ],
      },
    };
  }

  route_DocumentCollection(auth, userRole, user) {
    var status = {
      legal_index: true,
      legal_create: true,
      legal_edit: true,
      legal_view: true,
      legal_delete: true,
    };

    return {
      document_collection_parent: {
        hidden_menu: false,
        status: status,
        icon: <GiNewspaper />,
        document: "document_collection",
        title: "ព្រឹត្តិការណ៍",
        breadcurmb: [],
      },

      legal_index: {
        status: status.legal_index,
        document: "document_collection",
        url: "/admin/events/legals",
        title: "លិខិតបទដ្ឋានគតិយុត្ត",
        component: <LegalIndex auth={auth} />,
        icon: <GoLaw />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/legals",
          },
          {
            name: "លិខិតបទដ្ឋានគតិយុត្ត",
            path: "/admin/events/legals",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },
      legal_create: {
        status: status.legal_create,
        document: "document_collection",
        url: "/admin/events/legals/create",
        title: "លិខិតបទដ្ឋានគតិយុត្ត",
        component: <LegalForm mode={"create"} auth={auth} />,
        icon: <GoLaw />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/legals",
          },
          {
            name: "លិខិតបទដ្ឋានគតិយុត្ត",
            path: "/admin/events/legals",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },
      legal_edit: {
        status: status.legal_edit,
        document: "document_collection",
        url: "/admin/events/legals/edit/:id",
        title: "លិខិតបទដ្ឋានគតិយុត្ត",
        component: <LegalForm mode={"edit"} auth={auth} />,
        icon: <GoLaw />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/legals",
          },
          {
            name: "លិខិតបទដ្ឋានគតិយុត្ត",
            path: "/admin/events/legals",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
      legal_view: {
        status: status.legal_view,
        document: "document_collection",
        url: "/admin/events/legals/view/:id",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <LegalForm mode={"view"} auth={auth} />,
        icon: <GoLaw />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/legals",
          },
          {
            name: "លិខិតបទដ្ឋានគតិយុត្ត",
            path: "/admin/events/legals",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },
      legal_delete: {
        status: status.legal_delete,
        document: "document_collection",
        breadcurmb: [],
      },
    };
  }

  route_Report(auth, userRole, user) {
    var status = {
      report_index: true,
      report_create: true,
      report_edit: true,
      report_view: true,
      report_delete: true,
    };

    return {
      report_parent: {
        hidden_menu: false,
        status: status,
        icon: <FaChartBar />,
        document: "report_ssmr_drp",
        title: "ទិន្នន័យ",
        breadcurmb: [],
      },

      report_index: {
        status: status.report_index,
        document: "report_ssmr_drp",
        url: "/admin/report",
        title: "របាយការណ៍",
        component: <IndexReport auth={auth} />,
        icon: <FaChartGantt />,
        breadcurmb: [
          {
            name: "របាយការណ៍",
            path: "/admin/report",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },
      report_create: {
        status: status.report_create,
        document: "report_ssmr_drp",
        url: "/admin/report/create",
        title: "របាយការណ៍",
        component: <FormReport mode={"create"} auth={auth} />,
        icon: <FaChartGantt />,
        breadcurmb: [
          {
            name: "របាយការណ៍",
            path: "/admin/report",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },
      report_edit: {
        status: status.report_edit,
        document: "report_ssmr_drp",
        url: "/admin/report/edit/:id",
        title: "របាយការណ៍",
        component: <FormReport mode={"edit"} auth={auth} />,
        icon: <FaChartGantt />,
        breadcurmb: [
          {
            name: "របាយការណ៍",
            path: "/admin/report",
          },

          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
      report_view: {
        status: status.report_view,
        document: "report_ssmr_drp",
        url: "/admin/report/view/:id",
        title: "របាយការណ៍",
        component: <FormReport mode={"view"} auth={auth} />,
        icon: <FaChartGantt />,
        breadcurmb: [
          {
            name: "របាយការណ៍",
            path: "/admin/report",
          },

          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },
      report_delete: {
        status: status.report_delete,
        document: "report_ssmr_drp",
        breadcurmb: [],
      },
    };
  }

  route_GS(auth, userRole, user) {
    var status = {
      management_structrue_index: true,
      about_gs_index: true,
      role_and_responsibility_index: true,

      speech_index: true,
      speech_create: true,
      speech_edit: true,
      speech_view: true,
      speech_delete: true,
    };

    return {
      about_gs_parent: {
        hidden_menu: false,
        status: status,
        icon: <MdGroupWork />,
        document: "about_gs",
        title: "អំពីអគ្គនាយកដ្ឋាន",
        breadcurmb: [],
      },

      management_structrue_index: {
        status: status.management_structrue_index,
        document: "about_gs",
        url: "/admin/about-gs/management-structure",
        title: "រចនាសម្ព័ន្ធការគ្រប់គ្រង",
        component: <ManagementStructure auth={auth} />,
        icon: <VscSymbolStructure />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/management-structure",
          },
          {
            name: "រចនាសម្ព័ន្ធនៃការគ្រប់គ្រង",
            path: "/admin/about-gs/management-structure",
          },
        ],
      },

      role_and_responsibility_index: {
        status: status.role_and_responsibility_index,
        document: "about_gs",
        url: "/admin/about-gs/role-and-responsibility",
        title: "តួនាទី និងភារកិច្ច",
        component: <RoleAndResponsibilityIndex auth={auth} />,
        icon: <FaRegAddressBook />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/role-and-responsibility",
          },
          {
            name: "តួនាទី​ និងភារកិច្ច",
            path: "/admin/about-gs/role-and-responsibility",
          },
        ],
      },

      about_gs_index: {
        status: status.about_gs_index,
        document: "about_gs",
        url: "/admin/about-gs/direct-message",
        title: "សារអគ្គនាយក",
        component: <MessageIndex auth={auth} />,
        icon: <HiMiniDocumentText />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/direct-message",
          },
          {
            name: "សារអគ្គនាយក",
            path: "/admin/about-gs/direct-message",
          },
        ],
      },

      speech_index: {
        status: status.speech_index,
        document: "about_gs",
        url: "/admin/about-gs/speech",
        title: "សុន្ទរកថា",
        component: <IndexSpeech auth={auth} />,
        icon: <LuSpeech />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/speech",
          },
          {
            name: "សុន្ទរកថា",
            path: "/admin/about-gs/speech",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },

      speech_create: {
        status: status.speech_create,
        document: "about_gs",
        url: "/admin/about-gs/speech/create",
        title: "ព័ត៌មាន",
        component: <FormSpeech mode={"create"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/speech",
          },
          {
            name: "សុន្ទរកថា",
            path: "/admin/about-gs/speech",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },

      speech_edit: {
        status: status.speech_edit,
        document: "about_gs",
        url: "/admin/about-gs/speech/edit/:id",
        title: "ព័ត៌មាន",
        component: <FormSpeech mode={"edit"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/speech",
          },
          {
            name: "សុន្ទរកថា",
            path: "/admin/about-gs/speech",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },

      speech_view: {
        status: status.speech_view,
        document: "about_gs",
        url: "/admin/about-gs/speech/view/:id",
        title: "ព័ត៌មាន",
        component: <FormSpeech mode={"view"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "អំពីអគ្គនាយកដ្ឋាន",
            path: "/admin/about-gs/speech",
          },
          {
            name: "សុន្ទរកថា",
            path: "/admin/about-gs/speech",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },

      speech_delete: {
        status: status.news_delete,
        document: "about_gs",
        breadcurmb: [],
      },
    };
  }

  route_Events(auth, userRole, user) {
    var status = {
      news_index: true,
      news_create: true,
      news_edit: true,
      news_view: true,
      news_delete: true,

      image_album_index: true,
      image_album_create: true,
      image_album_edit: true,
      image_album_view: true,
      image_album_delete: true,

      video_album_index: true,
      video_album_create: true,
      video_album_edit: true,
      video_album_view: true,
      video_album_delete: true,

      // legal_index: true,
      // legal_create: true,
      // legal_edit: true,
      // legal_view: true,
      // legal_delete: true,
    };

    return {
      events_parent: {
        hidden_menu: false,
        status: status,
        icon: <CgWebsite />,
        document: "events",
        title: "ព្រឹត្តិការណ៍",
        breadcurmb: [],
      },

      news_index: {
        status: status.news_index,
        document: "events",
        url: "/admin/events/news",
        title: "ព័ត៌មាន",
        component: <FormIndex auth={auth} />,
        icon: <HiMiniDocumentText />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/news",
          },
          {
            name: "ព័ត៌មាន",
            path: "/admin/events/news",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },
      news_create: {
        status: status.news_create,
        document: "events",
        url: "/admin/events/news/create",
        title: "ព័ត៌មាន",
        component: <FormNews mode={"create"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/news",
          },
          {
            name: "ព័ត៌មាន",
            path: "/admin/events/news",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },
      news_edit: {
        status: status.news_edit,
        document: "events",
        url: "/admin/events/news/edit/:id",
        title: "ព័ត៌មាន",
        component: <FormNews mode={"edit"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/news",
          },
          {
            name: "ព័ត៌មាន",
            path: "/admin/events/news",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
      news_view: {
        status: status.news_view,
        document: "events",
        url: "/admin/events/news/view/:id",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <GroupForm mode={"view"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/news",
          },
          {
            name: "ព័ត៌មាន",
            path: "/admin/events/news",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },
      news_delete: {
        status: status.news_delete,
        document: "events",
        breadcurmb: [],
      },

      image_album_index: {
        status: status.image_album_index,
        document: "events",
        url: "/admin/events/photo-albums",
        title: "កម្រងរូបភាព",
        component: <IndexImageAlbum auth={auth} />,
        icon: <CiImageOn />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/photo-albums",
          },
          {
            name: "កម្រងរូបភាព",
            path: "/admin/events/photo-albums",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },

      image_album_create: {
        status: status.image_album_create,
        document: "events",
        url: "/admin/events/photo-albums/create",
        title: "កម្រងរូបភាព",
        component: <FormImageAlbum mode={"create"} auth={auth} />,
        icon: <CiImageOn />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/photo-albums",
          },
          {
            name: "កម្រងរូបភាព",
            path: "/admin/events/photo-albums",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },

      image_album_edit: {
        status: status.image_album_edit,
        document: "events",
        url: "/admin/events/photo-albums/edit/:id",
        title: "កម្រងរូបភាព",
        component: <FormImageAlbum mode={"edit"} auth={auth} />,
        icon: <CiImageOn />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/photo-albums",
          },
          {
            name: "កម្រងរូបភាព",
            path: "/admin/events/photo-albums",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },

      image_album_view: {
        status: status.image_album_view,
        document: "events",
        url: "/admin/events/photo-albums/view/:id",
        title: "កម្រងរូបភាព",
        component: <FormImageAlbum mode={"view"} auth={auth} />,
        icon: <CiImageOn />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/photo-albums",
          },
          {
            name: "កម្រងរូបភាព",
            path: "/admin/events/photo-albums",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },

      image_album_delete: {
        status: status.image_album_delete,
        document: "events",
        breadcurmb: [],
      },

      video_album_index: {
        status: status.video_album_index,
        document: "events",
        url: "/admin/events/video-albums",
        title: "កម្រងវីដេអូ",
        component: <IndexVideoAlbum auth={auth} />,
        icon: <CiVideoOn />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/video-albums",
          },
          {
            name: "កម្រងវីដេអូ",
            path: "/admin/events/video-albums",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },

      video_album_create: {
        status: status.video_album_create,
        document: "events",
        url: "/admin/events/video-albums/create",
        title: "កម្រងវីដេអូ",
        component: <FormVideoAlbum mode={"create"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/video-albums",
          },
          {
            name: "កម្រងវីដេអូ",
            path: "/admin/events/video-albums",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },

      video_album_edit: {
        status: status.video_album_edit,
        document: "events",
        url: "/admin/events/video-albums/edit/:id",
        title: "កម្រងវីដេអូ",
        component: <FormVideoAlbum mode={"edit"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/video-albums",
          },
          {
            name: "កម្រងវីដេអូ",
            path: "/admin/events/video-albums",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },

      video_album_view: {
        status: status.video_album_view,
        document: "events",
        url: "/admin/events/video-albums/view/:id",
        title: "កម្រងវីដេអូ",
        component: <FormImageAlbum mode={"view"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "ព្រឹត្តិការណ៍",
            path: "/admin/events/video-albums",
          },
          {
            name: "កម្រងវីដេអូ",
            path: "/admin/events/video-albums",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },

      video_album_delete: {
        status: status.video_album_delete,
        document: "events",
        breadcurmb: [],
      },

      // legal_index: {
      //   status: status.legal_index,
      //   document: "events",
      //   url: "/admin/events/legals",
      //   title: "លិខិតបទដ្ឋានគតិយុត្ត",
      //   component: <LegalIndex auth={auth} />,
      //   icon: <GoLaw />,
      //   breadcurmb: [
      //     {
      //       name: "ព្រឹត្តិការណ៍",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "លិខិតបទដ្ឋានគតិយុត្ត",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "បញ្ជី",
      //       path: null,
      //     },
      //   ],
      // },
      // legal_create: {
      //   status: status.legal_create,
      //   document: "events",
      //   url: "/admin/events/legals/create",
      //   title: "លិខិតបទដ្ឋានគតិយុត្ត",
      //   component: <LegalForm mode={"create"} auth={auth} />,
      //   icon: <GoLaw />,
      //   breadcurmb: [
      //     {
      //       name: "ព្រឹត្តិការណ៍",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "លិខិតបទដ្ឋានគតិយុត្ត",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "បង្កើត",
      //       path: null,
      //     },
      //   ],
      // },
      // legal_edit: {
      //   status: status.legal_edit,
      //   document: "events",
      //   url: "/admin/events/legals/edit/:id",
      //   title: "លិខិតបទដ្ឋានគតិយុត្ត",
      //   component: <LegalForm mode={"edit"} auth={auth} />,
      //   icon: <GoLaw />,
      //   breadcurmb: [
      //     {
      //       name: "ព្រឹត្តិការណ៍",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "លិខិតបទដ្ឋានគតិយុត្ត",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "កែប្រែ",
      //       path: null,
      //     },
      //   ],
      // },
      // legal_view: {
      //   status: status.legal_view,
      //   document: "events",
      //   url: "/admin/events/legals/view/:id",
      //   title: "គ្រប់គ្រងកម្មវិធី",
      //   component: <LegalForm mode={"view"} auth={auth} />,
      //   icon: <GoLaw />,
      //   breadcurmb: [
      //     {
      //       name: "ព្រឹត្តិការណ៍",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "លិខិតបទដ្ឋានគតិយុត្ត",
      //       path: "/admin/events/legals",
      //     },
      //     {
      //       name: "ពិនិត្យ",
      //       path: null,
      //     },
      //   ],
      // },
      // legal_delete: {
      //   status: status.legal_delete,
      //   document: "events",
      //   breadcurmb: [],
      // },
    };
  }

  route_WebsiteNew(auth, userRole, user) {
    var status = {
      footer_index: true,
      header_index: true,
      banner_index: true,
    };
    return {
      website_parent: {
        hidden_menu: false,
        status: status,
        icon: <AiOutlineInsertRowBelow />,
        document: "website",
        title: "ពត៌មានគេហទំព័រ",
        breadcurmb: [],
      },
      header_index: {
        status: status.header_index,
        document: "website",
        url: "/admin/gdr/website/header",
        title: "ព័ត៌មាន Header",
        component: <HeaderIndex prop={this.prop} auth={auth} />,
        icon: <MdOutlineNewspaper />,
        breadcurmb: [
          {
            name: "ព័ត៌មានគេហទំព័រ",
            path: "/admin/gdr/website/header",
          },

          {
            name: "ព័ត៌មាន Header",
            path: "/admin/gdr/website/header",
          },

          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
      footer_index: {
        status: status.footer_index,
        document: "website",
        url: "/admin/gdr/website/footer",
        title: "ព័ត៌មាន Footer",
        component: <FooterIndex prop={this.prop} auth={auth} />,
        icon: <FaNewspaper />,
        breadcurmb: [
          {
            name: "ព័ត៌មានគេហទំព័រ",
            path: "/admin/gdr/website/footer",
          },

          {
            name: "ព័ត៌មាន Footer",
            path: "/admin/gdr/website/footer",
          },

          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },

      banner_index: {
        status: status.banner_index,
        document: "website",
        url: "/admin/gdr/website/banner",
        title: "ផ្ទាំង Banner",
        component: <BannerPage prop={this.prop} auth={auth} />,
        icon: <RiSlideshowView />,
        breadcurmb: [
          {
            name: "ព័ត៌មានគេហទំព័រ",
            path: "/admin/gdr/website/banner",
          },

          {
            name: "ផ្ទាំង Banner",
            path: "/admin/gdr/website/banner",
          },

          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
    };
  }

  route_System(auth, userRole, user) {
    var status = {
      system_index: true,
      system_view: true,
      system_create: true,
    };
    return {
      system_parent: {
        hidden_menu: false,
        status: status,
        icon: <LuLogs />,
        document: "system",
        title: "ផ្សេងៗ​អំពីរប្រព័ន្ធ",
        breadcurmb: [],
      },
      system_index: {
        status: status.system_index,
        document: "system",
        url: "/admin/dhamma/version-log",
        title: "កំណត់ហេតុកំណែ",
        component: <VersionLog_Index prop={this.prop} auth={auth} />,
        icon: <RxActivityLog />,
        breadcurmb: [
          {
            name: "ផ្សេងៗ​អំពីរប្រព័ន្ធ",
            path: "/admin/dhamma/version-log",
          },
          {
            name: "កំណត់ហេតុកំណែ",
            path: "/admin/dhamma/version-log",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },

      system_view: {
        status: status.system_view,
        document: "system",
        url: "/admin/dhamma/version-log/view/:id",
        title: "កំណត់ហេតុកំណែ",
        component: <VersionLog_Form mode={"view"} auth={auth} />,
        icon: <RxActivityLog />,
        breadcurmb: [
          {
            name: "ផ្សេងៗ​អំពីរប្រព័ន្ធ",
            path: "/admin/dhamma/version-log",
          },
          {
            name: "កំណត់ហេតុកំណែ",
            path: "/admin/dhamma/version-log",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },

      system_create: {
        status: status.system_create,
        document: "system",
        url: "/admin/dhamma/version-log/create/",
        title: "កំណត់ហេតុកំណែ",
        component: <VersionLog_Form mode={"create"} auth={auth} />,
        icon: <RxActivityLog />,
        breadcurmb: [
          {
            name: "ផ្សេងៗ​អំពីរប្រព័ន្ធ",
            path: "/admin/dhamma/version-log",
          },
          {
            name: "កំណត់ហេតុកំណែ",
            path: "/admin/dhamma/version-log",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },
    };
  }

  route_Summary(auth, userRole, user) {
    var status = {
      summary_index: true,
      activity_log_index: false,
    };
    return {
      summary_parent: {
        hidden_menu: false,
        status: status,
        icon: <IoBarChartSharp />,
        document: "summary",
        title: "ផ្ទាំងទិន្នន័យ",
        breadcurmb: [],
      },
      summary_index: {
        status: status.summary_index,
        document: "summary",
        url: "/admin/summary",
        title: "ស្ថិតិ",
        component: <SummaryIndex prop={this.prop} auth={auth} />,
        icon: <IoBarChartSharp />,
        breadcurmb: [
          {
            name: "ផ្ទាំងទិន្នន័យ",
            path: "/admin/summary",
          },
          {
            name: "ស្ថិតិ",
            path: "/admin/summary",
          },
          {
            name: "សង្ខេប",
            path: null,
          },
        ],
      },
      activity_log_index: {
        status: status.activity_log_index,
        document: "summary",
        url: "/admin/activity-log",
        title: "សកម្មភាពក្នុងប្រ័ពន្ធ",
        component: <ActivityLogIndex prop={this.prop} auth={auth} />,
        icon: <BsWindowStack />,
        breadcurmb: [
          {
            name: "ផ្ទាំងទិន្នន័យ",
            path: "/admin/summary",
          },
          {
            name: "សកម្មភាពក្នុងប្រ័ពន្ធ",
            path: "/admin/summary",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },
    };
  }

  route_User(auth, userRole, user) {
    var status = {
      user_group_index: false,
      user_group_create: false,
      user_group_edit: false,
      user_group_view: false,
      user_group_delete: false,
      user_account_index: this.checkPermission(
        userRole?.is_super_admin,
        user?.group_user_id,
        userRole,
      ),
      user_account_create: this.checkPermission(
        userRole?.is_super_admin,
        user?.group_user_id,
        userRole,
      ),
      user_account_edit: this.checkPermission(
        userRole?.is_super_admin,
        user?.group_user_id,
        userRole,
      ),
      user_account_view: this.checkPermission(
        userRole?.is_super_admin,
        user?.group_user_id,
        userRole,
      ),
      user_account_delete: this.checkPermission(
        userRole?.is_super_admin,
        user?.group_user_id,
        userRole,
      ),
    };

    return {
      user_group_parent: {
        hidden_menu: false,
        status: status,
        icon: <GrSystem />,
        document: "user",
        title: "គ្រប់គ្រងកម្មវិធី",
        breadcurmb: [],
      },
      user_group_index: {
        status: status.user_group_index,
        document: "user",
        url: "/admin/user/group",
        title: "កំណត់សិទ្ធប្រើប្រាស់",
        component: <GroupIndex auth={auth} />,
        icon: <FaPeopleGroup />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/group",
          },
          {
            name: "កំណត់សិទ្ធប្រើប្រាស់",
            path: "/admin/user/group",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },
      user_group_create: {
        status: status.user_group_create,
        document: "user",
        url: "/admin/user/group/create",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <GroupForm mode={"create"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/group",
          },
          {
            name: "កំណត់សិទ្ធប្រើប្រាស់",
            path: "/admin/user/group",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },
      user_group_edit: {
        status: status.user_group_edit,
        document: "user",
        url: "/admin/user/group/edit/:id",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <GroupForm mode={"edit"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/group",
          },
          {
            name: "កំណត់សិទ្ធប្រើប្រាស់",
            path: "/admin/user/group",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
      user_group_view: {
        status: status.user_group_view,
        document: "user",
        url: "/admin/user/group/view/:id",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <GroupForm mode={"view"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/group",
          },
          {
            name: "កំណត់សិទ្ធប្រើប្រាស់",
            path: "/admin/user/group",
          },
          {
            name: "ពិនិត្យ",
            path: null,
          },
        ],
      },
      user_group_delete: {
        status: status.user_group_delete,
        document: "user",
        breadcurmb: [],
      },

      // ==> User
      user_account_index: {
        status: status.user_account_index,
        document: "user",
        url: "/admin/user/account",
        title: "គណនីអ្នកប្រើប្រាស់",
        component: <AccountIndex auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/account",
          },
          {
            name: "គណនីអ្នកប្រើប្រាស់",
            path: "/admin/user/account",
          },
          {
            name: "បញ្ជី",
            path: null,
          },
        ],
      },
      user_account_create: {
        status: status.user_account_create,
        document: "user",
        url: "/admin/user/account/create",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <AccountForm mode={"create"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/account",
          },
          {
            name: "គណនីអ្នកប្រើប្រាស់",
            path: "/admin/user/account",
          },
          {
            name: "បង្កើត",
            path: null,
          },
        ],
      },
      user_account_edit: {
        status: status.user_account_edit,
        document: "user",
        url: "/admin/user/account/edit/:id",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <AccountForm mode={"edit"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/account/create",
          },
          {
            name: "គណនីអ្នកប្រើប្រាស់",
            path: "/admin/user/account/create",
          },
          {
            name: "កែប្រែ",
            path: null,
          },
        ],
      },
      user_account_view: {
        status: status.user_account_view,
        document: "user",
        url: "/admin/user/account/view/:id",
        title: "គ្រប់គ្រងកម្មវិធី",
        component: <AccountForm mode={"view"} auth={auth} />,
        icon: <MdAccountCircle />,
        breadcurmb: [
          {
            name: "គ្រប់គ្រងកម្មវិធី",
            path: "/admin/user/account/create",
          },
          {
            name: "គណនីអ្នកប្រើប្រាស់",
            path: "/admin/user/account/create",
          },
          {
            name: "ពិនត្យ",
            path: null,
          },
        ],
      },
      user_account_delete: {
        status: status.user_account_delete,
        document: "user",
        breadcurmb: [],
      },
    };
  }

  route_MyAccount(auth) {
    var status = {
      my_account_index: true,
      super_admin_unit_index: auth.getClientLogin()?.data?.is_super_admin,
    };

    return {
      my_account_parent: {
        hidden_menu: true,
        status: status,
        icon: <IoBarChartSharp />,
        document: "my_account",
        title: "គណនីរបស់ខ្ញុំ",
        breadcurmb: [],
      },
      my_account_index: {
        status: status.my_account_index,
        document: "my_account",
        url: "/admin/my-account",
        title: "គណនីរបស់ខ្ញុំ",
        component: <MyAccountIndex auth={auth} />,
        icon: <IoIosPeople />,
        breadcurmb: [
          {
            name: "គណនី",
            path: "/admin/my-account",
          },

          {
            name: "ព័ត៌មានរបស់ខ្ញុំ",
            path: null,
          },
        ],
      },
    };
  }
}

export default RouteScript;
