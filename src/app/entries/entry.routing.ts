import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntryLayoutComponent } from './entry-layout/entry-layout.component';
import { MainLayoutComponent } from './entry-layout/main-layout/main.layout.component';

import { PagesComponent } from './static/pages/pages.component';

import { ProfileComponent } from './account/profile/profile.component';
import { ActivityComponent } from './account/candy-club/activity/activity.component';
import { MyAccountComponent } from './account/candy-club/user-my-account/my-account.component';
import { UserUpdateProfileComponent } from './account/candy-club/user-edit-profile/user-update-profile.component';
import { AboutComponent } from './account/candy-club/about/about.component';
import { FollowersComponent } from './account/followers/followers.component';
import { FollowingComponent } from './account/following/following.component';
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
                path: "profile",
                component: ProfileComponent,
                canActivate: [AuthGuard],
                data: {title : "My Profile", expectedRole: 'onlyUser'},
            },
            {
                path: "candy-club/:username",
                component: AboutComponent,
                canActivate: [AuthGuard],
                data: {title : "Profile", expectedRole: 'onlyUser'},
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
                path: 'followers', 
                component: FollowersComponent,
                canActivate: [AuthGuard],
                data: {title : "My Followers", expectedRole: 'onlyUser'},
            },
            {
                path: 'followings', 
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
