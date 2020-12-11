import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntryLayoutComponent } from './entry-layout/entry-layout.component';
import { MainLayoutComponent } from './entry-layout/main-layout/main.layout.component';

import { PagesComponent } from './static/pages/pages.component';
import { NewsComponent } from './static/news/news.component';

import { ProfileComponent } from './account/profile/profile.component';
import { ActivityComponent } from './account/candy-club/activity/activity.component';
import { MyAccountComponent } from './account/candy-club/user-my-account/my-account.component';
import { UserUpdateProfileComponent } from './account/candy-club/user-edit-profile/user-update-profile.component';
import { AboutComponent } from './account/candy-club/about/about.component';
import { FollowersComponent } from './account/candy-club/followers/followers.component';
import { FollowingComponent } from './account/candy-club/following/following.component';
import { PaidVideosComponent } from './account/paid-videos/paid-videos.component';
import { StreamedVideosComponent } from './account/streamed-videos/streamed-videos.component';
import { SettingsComponent } from './account/settings/settings.component';
import { MyplansComponent } from './account/my-plans/my-plans.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentSuccessComponent } from './subscription/payment-success/payment-success.component';
import { PaymentFailureComponent } from './subscription/payment-failure/payment-failure.component';
import { InvoiceComponent } from './subscription/invoice/invoice.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SearchComponent } from './search/search.component';
import { VideoInvoiceComponent } from './live/ppv-invoice/invoice.component';
import { BroadcastComponent } from './live/broadcast/broadcast.component';
import { SingleVideoComponent } from './live/single-video/single-video.component';
import { JoinVideoComponent } from './live/join-video/join-video.component';

import { UploadVideoComponent } from './vod-management/upload-video/upload-video.component';
import { EditVideoComponent } from './vod-management/edit-video/edit-video.component';
import { VODhistoryComponent } from './vod-management/vod-history/vod-history.component';
import { VODlistComponent } from './vod-management/vod-list/vod-list.component';
import { VODrevenueComponent } from './vod-management/vod-revenue/vod-revenue.component';
import { VODviewComponent } from './vod-management/vod-view/vod-view.component';
import { VODvideosComponent } from './vod-management/vod-videos/vod-videos.component';
import { VODInvoiceComponent } from './vod-management/vod-invoice/invoice.component';
import { RedeemsComponent } from './redeems/redeems.component';

import { AndroidJoinComponent } from './android/join-video/join-video.component';
import { AndroidStreamerComponent } from './android/streamer-video/streamer-video.component';

import { AddCardComponent } from './subscription/cards/add-card/add-card.component';
import { CardDetailsComponent } from './subscription/cards/card-details/card-details.component';
import { AuthGuard } from '../common/auth/auth.guard';

import { CanDeactivateGuard } from './can-deactivate-guard.service';

import { GroupsComponent } from './account/groups/group.component';
import { CreateGroupComponent } from './account/groups/create-group/create-group.component';
import { ViewGroupComponent } from './account/groups/view-group/view-group.component';
import { EditGroupComponent } from './account/groups/edit-group/edit-group.component';

import { LiveTVComponent } from './live-tv/live-tv.component';
import { LiveVideoComponent } from './live-tv/single-video/single-video.component';
import { LiveTvListComponent } from './live-tv/live-tv-list/live-tv-list.component';
import { EditLiveVideoComponent } from './live-tv/edit/edit.component';
import { UploadLiveVideoComponent } from './live-tv/upload/upload.component';

import { SearchLivetvComponent } from './search/live-tv/live-tv.component';
import { SearchLivevideosComponent } from './search/live-videos/live-video.component';
import { SearchUsersComponent } from  './search/users/users.component';
import { CandiesPackageComponent } from './candy-packages/package/candies-package.component';
import { CandiesInvoiceComponent } from './candy-packages/invoice/candies-invoice.component';
import { CandiesPaymentSuccessComponent } from './candy-packages/payment-success/candies-payment-success.component';
import { CandiesPaymentFailureComponent } from './candy-packages/payment-failure/candies-payment-failure.component';
import { VipMembershipComponent } from './account/candy-club/vip-membership/vip-membership.component';
import { MyFanClubComponent } from './account/candy-club/my-fan-club/my-fan-club.component';
import { MessageComponent } from './account/candy-club/message/message.component';
import { EarningHistoryComponent } from './account/candy-club/earning-history/earning-history.component';
import { MyGiftComponent } from './account/candy-club/my-gift/my-gift.component';
import { AlbumComponent } from './account/candy-club/album/album.component';
import { AlbumDetailsComponent } from './account/candy-club/album/album-details/album-details.component';
import { CollectionComponent } from './account/candy-club/collection/collection.component';
import { FreeShowPhotoComponent } from './account/candy-club/free-show-photo/free-show-photo.component';
import { NudeShowPhotoComponent } from './account/candy-club/nude-show-photo/nude-show-photo.component';
import { ModelNewsComponent } from './account/candy-club/model-news/model-news.component';
import { ModelScheduleComponent } from './account/candy-club/model-schedule/model-schedule.component';
import { RecordedVideoComponent } from './account/candy-club/recorded-video/recorded-video.component';
import { SweetTreatComponent } from './account/candy-club/sweet-treat/sweet-treat.component';
import { SweetTreatDetailsComponent } from './account/candy-club/sweet-treat/sweet-treat-details/sweet-treat-details.component';
import { TopModelComponent } from './account/candy-club/top-model/top-model.component';
import { UploadPhotoComponent } from './account/candy-club/upload-photo/upload-photo.component';
import { UploadVideosComponent } from './account/candy-club/upload-videos/upload-videos.component';
import { MakeMoreMoneyComponent } from './account/candy-club/make-more-money/make-more-money.component';
import { ComplianceStatementComponent } from './account/candy-club/compliance-statement/compliance-statement.component';
import { CookiePolicyComponent } from './account/candy-club/cookie-policy/cookie-policy.component';
import { DcmaCompliantComponent } from './account/candy-club/dcma-compliant/dcma-compliant.component';
import { NoticeAboutPerformerComponent } from './account/candy-club/notice-about-performer/notice-about-performer.component';
import { PrivacyPolicyComponent } from './account/candy-club/privacy-policy/privacy-policy.component';
import { PerformerDashboardComponent } from './account/candy-club/performer-dashboard/performer-dashboard.component';
import { StartStreamingComponent } from './account/candy-club/start-streaming/start-streaming.component';
import { UpdateAccountRecordComponent } from './account/candy-club/update-account-record/update-account-record.component';
import { WhySignupWithUsComponent } from './account/candy-club/why-signup-with-us/why-signup-with-us.component';
import { ModelDashboardComponent } from './account/candy-club/model-dashboard/model-dashboard.component';
import { ViewModelProfileComponent } from './view-model-profile/view-model-profile.component';
import { ModelFollowersComponent } from './view-model-profile/model-followers/model-followers.component';
import { ModelFollowingsComponent } from './view-model-profile/model-followings/model-followings.component';
import { ModelActivityComponent } from './view-model-profile/model-activity/model-activity.component';
import { CollectionDetailsComponent } from './account/candy-club/collection/collection-details/collection-details.component';
import { ViewUserProfileComponent } from './view-user-profile/view-user-profile.component';
import { UserFollowersComponent } from './view-user-profile/user-followers/user-followers.component';
import { UserFollowingsComponent } from './view-user-profile/user-followings/user-followings.component';
const entryRoutes: Routes = [
    { path: 'viewer-video', 
        component:AndroidJoinComponent ,
        canActivate: [AuthGuard],
        data: {title: "Viewer Video",  
        expectedRole: 'guestUser'},
    },
    { path: 'streamer-video', 
        component:AndroidStreamerComponent ,  
        canActivate: [AuthGuard],
        data: {title: "Streamer Video",  
        expectedRole: 'guestUser'},
    },
    {
        path: '',
        component:MainLayoutComponent,
        children: [
            {
                path: 'broadcast', 
                component: BroadcastComponent,
                canActivate: [AuthGuard],
                data: {title: "Broadcast Video Form",  expectedRole: 'onlyUser'},
            },
            {
                path: 'single-video',
                component: SingleVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "My Broadcasting",  expectedRole: 'onlyUser'},
               // canDeactivate : [CanDeactivateGuard],
            },
            {
                path: 'join-video',
                component: JoinVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "Join Streaming Video", expectedRole: 'guestUser'},
            },
            {
                path: 'groups',
                component: GroupsComponent,
                canActivate: [AuthGuard],
                data: {title : "Groups List", expectedRole: 'onlyUser'},
            },
            {
                path: 'create-group', 
                component: CreateGroupComponent,
                canActivate: [AuthGuard],
                data: {title : "Create Group", expectedRole: 'onlyUser'},
            },
            {
                path: 'view-group', 
                component: ViewGroupComponent,
                canActivate: [AuthGuard],
                data: {title : "View Group", expectedRole: 'onlyUser'},
            },
            {
                path: 'edit-group',
                component: EditGroupComponent,
                canActivate: [AuthGuard],
                data: {title : "Edit Group", expectedRole: 'onlyUser'},
            },
        ]
    },
    {
        path: '',
        component:EntryLayoutComponent,
        /*
        canActivate: [AuthGuard],
        data: { 
          expectedRole: 'onlyUser'
        }, */
        children: [
            {
                path: "page",
                component: PagesComponent,
                canActivate: [AuthGuard],
                data: {title : "Static Page", expectedRole: 'guestUser'},
            },
            {
                path: "news",
                component: NewsComponent,
                canActivate: [AuthGuard],
                data: {title : "Static Page", expectedRole: 'guestUser'},
            },
            {
                path: "profile",
                component: ProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "My Profile", expectedRole: 'onlyUser'},
            },
            {
                path: "compliance-statement",
                component: ComplianceStatementComponent,
                canActivate: [AuthGuard],
                data: {title : "Compliance Statement", expectedRole: 'guestUser'},
            },
            {
                path: "privacy-policy",
                component: PrivacyPolicyComponent,
                canActivate: [AuthGuard],
                data: {title : "Privacy Policy", expectedRole: 'guestUser'},
            },
            {
                path: "cookie-policy",
                component: CookiePolicyComponent,
                canActivate: [AuthGuard],
                data: {title : "Cookie Policy", expectedRole: 'guestUser'},
            },
            {
                path: "dcma-compliant",
                component: DcmaCompliantComponent,
                canActivate: [AuthGuard],
                data: {title : "DCMA Compliant", expectedRole: 'guestUser'},
            },
            {
                path: "notice-about-individual-performer",
                component: NoticeAboutPerformerComponent,
                canActivate: [AuthGuard],
                data: {title : "Notice About Individual Performer", expectedRole: 'guestUser'},
            },
            {
                path: "affiliate-area",
                component: MakeMoreMoneyComponent,
                canActivate: [AuthGuard],
                data: {title : "Affiliate Area", expectedRole: 'guestUser'},
            },
            {
                path: "performer-dashboard",
                component: PerformerDashboardComponent,
                canActivate: [AuthGuard],
                data: {title : "Performer Dashboard", expectedRole: 'onlyUser'},
            },
            {
                path: "start-streaming",
                component: StartStreamingComponent,
                canActivate: [AuthGuard],
                data: {title : "Start Streaming", expectedRole: 'onlyUser'},
            },
            {
                path: "update-account-record",
                component: UpdateAccountRecordComponent,
                canActivate: [AuthGuard],
                data: {title : "Update Account Record", expectedRole: 'onlyUser'},
            },
            {
                path: "why-signup-with-us",
                component: WhySignupWithUsComponent,
                canActivate: [AuthGuard],
                data: {title : "Why Signup With Us", expectedRole: 'onlyUser'},
            },
            {
                path: "model-dashboard",
                component: ModelDashboardComponent,
                canActivate: [AuthGuard],
                data: {title : "Model Dashboard", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/model/:modelname',
                component: ViewModelProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "Profile view", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/model/:modelname/about',
                component: ViewModelProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "About", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/model/:modelname/followers',
                component: ModelFollowersComponent,
                canActivate: [AuthGuard],
                data: {title : "Followers", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/model/:modelname/followings',
                component: ModelFollowingsComponent,
                canActivate: [AuthGuard],
                data: {title : "Followings", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/model/:modelname/activity',
                component: ModelActivityComponent,
                canActivate: [AuthGuard],
                data: {title : "Followings", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username",
                component: AboutComponent,
                canActivate: [AuthGuard],
                data: {title : "Profile", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/user/:username",
                component: ViewUserProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "Profile", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/user/:username/about",
                component: ViewUserProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "Profile", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/user/:username/followers', 
                component: UserFollowersComponent,
                canActivate: [AuthGuard],
                data: {title : "My Followers", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/user/:username/followings',
                component: UserFollowingsComponent,
                canActivate: [AuthGuard],
                data: {title : "Who I am Following", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/about",
                component: AboutComponent,
                canActivate: [AuthGuard],
                data: {title : "About", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/activity",
                component: ActivityComponent,
                canActivate: [AuthGuard],
                data: {title : "My Activity", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/edit-profile",
                component: UserUpdateProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "Edit Profile", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/my-fan-club",
                component: MyFanClubComponent,
                canActivate: [AuthGuard],
                data: {title : "My Fan Club", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/messages",
                component: MessageComponent,
                canActivate: [AuthGuard],
                data: {title : "Messages", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/earning-history",
                component: EarningHistoryComponent,
                canActivate: [AuthGuard],
                data: {title : "Earning History", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/my-gifts",
                component: MyGiftComponent,
                canActivate: [AuthGuard],
                data: {title : "My Gifts", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/album",
                component: AlbumComponent,
                canActivate: [AuthGuard],
                data: {title : "My Album", expectedRole: 'onlyUser'},
            },
            { 
                path: "candy-club/:username/album/:id",
                component: AlbumDetailsComponent,
                canActivate: [AuthGuard],
                data: {title : "Album Details", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/collection",
                component: CollectionComponent,
                canActivate: [AuthGuard],
                data: {title : "My Collections", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/collection/:collection_id",
                component: CollectionDetailsComponent,
                canActivate: [AuthGuard],
                data: {title : "Collections details", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/free-show-photo",
                component: FreeShowPhotoComponent,
                canActivate: [AuthGuard],
                data: {title : "My Free Show Photo", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/nude-show-photo",
                component: NudeShowPhotoComponent,
                canActivate: [AuthGuard],
                data: {title : "My Nude Show Photo", expectedRole: 'onlyUser'},
            },
            {
                path: "model-news",
                component: ModelNewsComponent,
                canActivate: [AuthGuard],
                data: {title : "Model News", expectedRole: 'guestUser'},
            },
            {
                path: "candy-club/:username/model-schedule",
                component: ModelScheduleComponent,
                canActivate: [AuthGuard],
                data: {title : "Model Schedule", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/recorded-video",
                component: RecordedVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "My Recorded Video", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/sweet-treat",
                component: SweetTreatComponent,
                canActivate: [AuthGuard],
                data: {title : "My Sweet Treat", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/sweet-treat/:id",
                component: SweetTreatDetailsComponent,
                canActivate: [AuthGuard],
                data: {title : "Sweet Treat Details", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/top-model",
                component: TopModelComponent,
                canActivate: [AuthGuard],
                data: {title : "Top Model", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/upload-photo",
                component: UploadPhotoComponent,
                canActivate: [AuthGuard],
                data: {title : "Upload Photo", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username/upload-video",
                component: UploadVideosComponent,
                canActivate: [AuthGuard],
                data: {title : "Upload Videos", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/vip-membership",
                component: VipMembershipComponent,
                canActivate: [AuthGuard],
                data: {title : "Edit Profile", expectedRole: 'onlyUser'},
            },
            {
                path: "account",
                component: MyAccountComponent,
                canActivate: [AuthGuard],
                data: {title : "My Account", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/:username/followers', 
                component: FollowersComponent,
                canActivate: [AuthGuard],
                data: {title : "My Followers", expectedRole: 'onlyUser'},
            },
            {
                path: 'candy-club/:username/followings',
                component: FollowingComponent,
                canActivate: [AuthGuard],
                data: {title : "Who I am Following", expectedRole: 'onlyUser'},
            },
            {
                path: 'paid-videos', 
                component: PaidVideosComponent,
                canActivate: [AuthGuard],
                data: {title : "My Paid - Watch History", expectedRole: 'onlyUser'},
            },
            {
                path: 'streamed-videos', 
                component: StreamedVideosComponent,
                canActivate: [AuthGuard],
                data: {title : "My Streaming History", expectedRole: 'onlyUser'},
            },
            {
                path: 'settings', 
                component: SettingsComponent,
                canActivate: [AuthGuard],
                data: {title : "Settings", expectedRole: 'onlyUser'},
            },
            {
                path: 'my-plans', 
                component: MyplansComponent,
                canActivate: [AuthGuard],
                data: {title : "My Plans", expectedRole: 'onlyUser'},
            },
            {
                path: 'subscription', 
                component: SubscriptionComponent,
                canActivate: [AuthGuard],
                data: {title : "Subscription Plans", expectedRole: 'onlyUser'},
            },
            {
                path: 'candies-package', 
                component: CandiesPackageComponent,
                canActivate: [AuthGuard],
                data: {title : "Buy Candies Packages", expectedRole: 'onlyUser'},
            },
            {
                path: 'buy_candies', 
                component: CandiesInvoiceComponent,
                canActivate: [AuthGuard],
                data: {title : "Buy Candies Packages", expectedRole: 'onlyUser'},
            },
            {
                path: 'candies-payment-success',
                component: CandiesPaymentSuccessComponent,
                canActivate: [AuthGuard],
                data: {title : "Payment Success", expectedRole: 'onlyUser'},
            },
            {
                path: 'candies-payment-failure',
                component: CandiesPaymentFailureComponent,
                canActivate: [AuthGuard],
                data: {title : "Payment Failure", expectedRole: 'onlyUser'},
            },
            {
                path: 'payment-success',
                component:PaymentSuccessComponent,
                canActivate: [AuthGuard],
                data: {title : "Payment Success", expectedRole: 'onlyUser'},
            },
            {
                path: 'payment-failure',
                component:PaymentFailureComponent,
                canActivate: [AuthGuard],
                data: {title : "Payment Failure", expectedRole: 'onlyUser'},
            },
            {
                path: 'invoice', 
                component: InvoiceComponent,
                canActivate: [AuthGuard],
                data: {title : "Invoice Page", expectedRole: 'onlyUser'},
            },
            {
                path: 'video/invoice', 
                component: VideoInvoiceComponent,
                canActivate: [AuthGuard],
                data: {title : "Invoice Page", expectedRole: 'onlyUser'},
            },

            {
                path: 'vod/invoice', 
                component: VODInvoiceComponent,
                canActivate: [AuthGuard],
                data: {title : "Invoice Page", expectedRole: 'onlyUser'},

            },
            {
                path: 'view-profile', 
                component: ViewProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "View Peer Profile", expectedRole: 'guestUser'},

            },
            {
                path: 'search', 
                component: SearchComponent,
                canActivate: [AuthGuard],
                data: {title : "Search Results", expectedRole: 'guestUser'},
            },
            // {
            //     path: 'broadcast', 
            //     component: BroadcastComponent,
            //     data: {title: "Broadcast Video Form"},
            // },
            // {
            //     path: 'single-video',
            //     component: SingleVideoComponent,
            //     data: {title : "My Broadcasting"},
            // },
            // {
            //     path: 'join-video',
            //     component: JoinVideoComponent,
            //     data: {title : "Join Streaming Video"},
            // },
            {
                path: 'upload-video',
                component: UploadVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD upload Video", expectedRole: 'onlyUser'},
            },
            {
                path: 'edit-video',
                component: EditVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD edit Video", expectedRole: 'onlyUser'},
            },
            {
                path: 'vod-history',
                component: VODhistoryComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD history", expectedRole: 'onlyUser'},
            },
            {
                path: 'vod-list',
                component: VODlistComponent,
                canActivate: [AuthGuard],
                data: {title : "My VOD List", expectedRole: 'onlyUser'},
            },
            {
                path: 'vod-view',
                component: VODviewComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD View", expectedRole: 'guestUser'},
            },
            {
                path: 'vod-revenue',
                component: VODrevenueComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD Revenue", expectedRole: 'onlyUser'},
            },
            {
                path: 'vod-videos',
                component: VODvideosComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD Videos", expectedRole: 'guestUser'},
            },
            {
                path: 'add-card',
                component: AddCardComponent,
                canActivate: [AuthGuard],
                data: {title : "Add Card", expectedRole: 'onlyUser'},
            },
            {
                path: 'card-details',
                component: CardDetailsComponent,
                canActivate: [AuthGuard],
                data: {title : "VOD Revenue", expectedRole: 'onlyUser'},
            },
            {
                path: 'redeems',
                component: RedeemsComponent,
                canActivate: [AuthGuard],
                data: {title : "Redeems", expectedRole: 'onlyUser'},
            },
            {
                path:'live-tv',
                component: LiveTVComponent,
                canActivate: [AuthGuard],
                data: {title : "Live TV", expectedRole: 'guestUser'},
            },
            {
                path: 'live-tv/view',
                component: LiveVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "View Live TV", expectedRole: 'guestUser'},
            },
            {
                path: 'live-tv/list',
                component: LiveTvListComponent,
                canActivate: [AuthGuard],
                data: {title : "Live TV", expectedRole: 'onlyUser'},
            },
            {
                path: 'live-tv/edit-video',
                component: EditLiveVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "Edit Live TV", expectedRole: 'onlyUser'},
            },
            {
                path: 'live-tv/upload-video',
                component: UploadLiveVideoComponent,
                canActivate: [AuthGuard],
                data: {title : "Upload Live TV", expectedRole: 'onlyUser'},
            },
            {
                path: 'live-tv/search',
                component: SearchLivetvComponent,
                canActivate: [AuthGuard],
                data: {title : "Live TV", expectedRole: 'guestUser'},
            },
            {
                path: 'live-videos/search',
                component: SearchLivevideosComponent,
                canActivate: [AuthGuard],
                data: {title : "Live Videos", expectedRole: 'guestUser'},
            },
            {
                path: 'users/search',
                component: SearchUsersComponent,
                canActivate: [AuthGuard],
                data: {title : "Users", expectedRole: 'guestUser'},
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(entryRoutes)],
    exports: [RouterModule]
})
export class EntryRoutingModule { }
