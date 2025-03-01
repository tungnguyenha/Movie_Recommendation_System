import Profile from "../Page/Customer/Profile";
import FavoritePage from "../Page/Customer/favoritePage";
import HistoryPage from "../Page/Customer/hisrotyPage";
import Home from "../Page/Customer/Home/home";
import Statistic from "../Page/Customer/statistic";
import { HistoryLayout } from "../components/Layout";
import HomeAdmin from "../Page/Admin/Home";
import AdminLayout from "../components/Layout/AdminLayout";
import StatisticAdm from "../Page/Admin/statistic";
import MovieAdm from "../Page/Admin/Movie";
import UserAdm from "../Page/Admin/UserAdm";
import DetailMovie from "../Page/Customer/detailMovie";
import AlertAdm from "../Page/Admin/AlertAdm";
import VoteCountMovie from "../Page/Admin/VoteCountMovie";

const publicRoute = [
    {path: '/', component: Home },
    {path: '/detail-movie/:id', component: DetailMovie },
    {path: '/history', component: HistoryPage,layout: HistoryLayout },
    {path: '/favorite', component: FavoritePage,layout: HistoryLayout },
    {path: '/statistic', component: Statistic,layout: HistoryLayout },
    {path: '/profile',component: Profile,layout: HistoryLayout},
    {path: '/adm/home',component: HomeAdmin,layout: AdminLayout},
    {path: '/adm/statistic',component: StatisticAdm,layout: AdminLayout},
    {path: '/adm/movie',component: MovieAdm,layout: AdminLayout},
    {path: '/adm/user',component: UserAdm,layout: AdminLayout},
    {path: '/adm/alert',component: AlertAdm,layout: AdminLayout},
    {path: '/adm/vote-count',component: VoteCountMovie,layout: AdminLayout},


]

export {publicRoute};