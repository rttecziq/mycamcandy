// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';

import { EntryRoutingModule } from './entry.routing';

import {AppService} from './../app.service';

import { EntryComponent } from './entry.component';

import { EntryLayoutComponent } from './entry-layout/entry-layout.component';
import { MainLayoutComponent } from './entry-layout/main-layout/main.layout.component';
import { EntryHeaderComponent } from './entry-layout/header/header.component';
import { EntryFooterComponent } from './entry-layout/footer/footer.component';
import { EntryFooterContentComponent } from './entry-layout/footer/footer-content.component';
import { EntrySidebarComponent } from './entry-layout/sidebar/sidebar.component';
import { PagesComponent } from './static/pages/pages.component';
import { NewsComponent } from './static/news/news.component';

import { ProfileComponent } from './account/profile/profile.component';
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
import { BroadcastComponent } from './live/broadcast/broadcast.component';
import { SingleVideoComponent } from './live/single-video/single-video.component';
import { JoinVideoComponent } from './live/join-video/join-video.component';
import { VideoInvoiceComponent } from './live/ppv-invoice/invoice.component';

import { UploadVideoComponent } from './vod-management/upload-video/upload-video.component';
import { EditVideoComponent } from './vod-management/edit-video/edit-video.component';
import { VODhistoryComponent } from './vod-management/vod-history/vod-history.component';
import { VODlistComponent } from './vod-management/vod-list/vod-list.component';
import { VODrevenueComponent } from './vod-management/vod-revenue/vod-revenue.component';
import { VODviewComponent } from './vod-management/vod-view/vod-view.component';
import { VODvideosComponent } from './vod-management/vod-videos/vod-videos.component';
import { VODInvoiceComponent } from './vod-management/vod-invoice/invoice.component';

import { RedeemsComponent } from './redeems/redeems.component';
import { AddCardComponent } from './subscription/cards/add-card/add-card.component';
import { CardDetailsComponent } from './subscription/cards/card-details/card-details.component';

// Version 4.0
import { GroupsComponent } from './account/groups/group.component';
import { GroupSidebarComponent } from './account/groups/sidebar/group-sidebar.component';
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

// Android
import { AndroidJoinComponent } from './android/join-video/join-video.component';
import { AndroidStreamerComponent } from './android/streamer-video/streamer-video.component';

// User Service
import { UserService } from  '../common/services/user.service';

import { ChatSocketService } from  '../common/services/chat-socket.service';

// To check Login user or not
import { AuthGuard } from '../common/auth/auth.guard';

// Dependancy modules for formsand request
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// ckeditor modules for model profile edit
import { CKEditorModule } from 'ng2-ckeditor';

import {TimeAgoPipe} from 'time-ago-pipe';

import { TitleService } from '../common/services/title.service';

import {CheckStreamerService} from '../common/services/check-streamer.service';

// date time picker
// import { NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

// For Translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivityComponent } from './account/candy-club/activity/activity.component';
import { AboutComponent } from './account/candy-club/about/about.component';
import { UserProfileTabsComponent } from './account/candy-club/user-profile-tabs/user-profile-tabs.component';
import { UserUpdateProfileComponent } from './account/candy-club/user-edit-profile/user-update-profile.component';
import { MyAccountComponent } from './account/candy-club/user-my-account/my-account.component';

// Candies
import { CandiesPackageComponent } from './candy-packages/package/candies-package.component';
import { CandiesInvoiceComponent } from './candy-packages/invoice/candies-invoice.component';
import { CandiesPaymentSuccessComponent } from './candy-packages/payment-success/candies-payment-success.component';
import { CandiesPaymentFailureComponent } from './candy-packages/payment-failure/candies-payment-failure.component';
import { VipMembershipComponent } from './account/candy-club/vip-membership/vip-membership.component';
import { MyFanClubComponent } from './account/candy-club/my-fan-club/my-fan-club.component';
import { MessageComponent } from './account/candy-club/message/message.component';
import { EarningHistoryComponent } from './account/candy-club/earning-history/earning-history.component';
import { MyGiftComponent } from './account/candy-club/my-gift/my-gift.component';
import { FreeShowPhotoComponent } from './account/candy-club/free-show-photo/free-show-photo.component';
import { NudeShowPhotoComponent } from './account/candy-club/nude-show-photo/nude-show-photo.component';
import { TopModelComponent } from './account/candy-club/top-model/top-model.component';
import { RecordedVideoComponent } from './account/candy-club/recorded-video/recorded-video.component';
import { AlbumComponent } from './account/candy-club/album/album.component';
import { CollectionComponent } from './account/candy-club/collection/collection.component';
import { SweetTreatComponent } from './account/candy-club/sweet-treat/sweet-treat.component';
import { ModelNewsComponent } from './account/candy-club/model-news/model-news.component';
import { ModelScheduleComponent } from './account/candy-club/model-schedule/model-schedule.component';
import { UploadPhotoComponent } from './account/candy-club/upload-photo/upload-photo.component';
import { UploadVideosComponent } from './account/candy-club/upload-videos/upload-videos.component';
import { SweetTreatDetailsComponent } from './account/candy-club/sweet-treat/sweet-treat-details/sweet-treat-details.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AlbumDetailsComponent } from './account/candy-club/album/album-details/album-details.component';
import { PrivacyPolicyComponent } from './account/candy-club/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './account/candy-club/cookie-policy/cookie-policy.component';

import { NoticeAboutPerformerComponent } from './account/candy-club/notice-about-performer/notice-about-performer.component';
import { ComplianceStatementComponent } from './account/candy-club/compliance-statement/compliance-statement.component';
import { MakeMoreMoneyComponent } from './account/candy-club/make-more-money/make-more-money.component';
import { WhySignupWithUsComponent } from './account/candy-club/why-signup-with-us/why-signup-with-us.component';
import { PerformerDashboardComponent } from './account/candy-club/performer-dashboard/performer-dashboard.component';
import { StartStreamingComponent } from './account/candy-club/start-streaming/start-streaming.component';
import { UpdateAccountRecordComponent } from './account/candy-club/update-account-record/update-account-record.component';
import { ModelDashboardComponent } from './account/candy-club/model-dashboard/model-dashboard.component';
import { PrivateMessageComponent } from './common/widget/private-message/private-message.component';
import { DcmaCompliantFormComponent } from './static/dcma-compliant-form/dcma-compliant-form.component';
import { DcmaCompliantComponent } from './account/candy-club/dcma-compliant/dcma-compliant.component';
import { MyFollowersComponent } from './common/widget/my-followers/my-followers.component';
import { BroadcastScheduleComponent } from './common/widget/broadcast-schedule/broadcast-schedule.component';
import { ViewModelProfileComponent } from './view-model-profile/view-model-profile.component';
import { SidebarTabsComponent } from './view-model-profile/sidebar-tabs/sidebar-tabs.component';
import { ModelFollowersComponent } from './view-model-profile/model-followers/model-followers.component';
import { ModelFollowingsComponent } from './view-model-profile/model-followings/model-followings.component';
import { ModelActivityComponent } from './view-model-profile/model-activity/model-activity.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        EntryComponent,
        MainLayoutComponent,
        EntryLayoutComponent,
        EntryHeaderComponent,
        EntryFooterComponent,
        EntryFooterContentComponent,
        EntrySidebarComponent,
        PagesComponent,
        NewsComponent,
        ProfileComponent,
        FollowersComponent,
        FollowingComponent,
        PaidVideosComponent,
        StreamedVideosComponent,
        SettingsComponent,
        MyplansComponent,
        SubscriptionComponent,
        CandiesPackageComponent,
        CandiesInvoiceComponent,
        CandiesPaymentSuccessComponent,
        CandiesPaymentFailureComponent,
        PaymentSuccessComponent,
        PaymentFailureComponent,
        InvoiceComponent,
        ViewProfileComponent,
        SearchComponent,
        BroadcastComponent,
        SingleVideoComponent,
        UploadVideoComponent,
        EditVideoComponent,
        VODhistoryComponent,
        VODlistComponent,
        VODrevenueComponent,
        VODviewComponent,
        VODvideosComponent,
        JoinVideoComponent,
        AddCardComponent,
        CardDetailsComponent,
        RedeemsComponent,
        VideoInvoiceComponent,
        VODInvoiceComponent,
        AndroidJoinComponent,
        AndroidStreamerComponent, 
        GroupsComponent,
        GroupSidebarComponent,
        CreateGroupComponent,
        ViewGroupComponent,
        EditGroupComponent, 
        LiveTVComponent,
        LiveVideoComponent,
        LiveTvListComponent,
        EditLiveVideoComponent,
        UploadLiveVideoComponent,
        SearchLivetvComponent,
        SearchLivevideosComponent,
        SearchUsersComponent,
        ActivityComponent,
        AboutComponent,
        UserProfileTabsComponent,
        UserUpdateProfileComponent,
        MyAccountComponent,
        VipMembershipComponent,
        MyFanClubComponent,
        MessageComponent,
        EarningHistoryComponent,
        MyGiftComponent,
        FreeShowPhotoComponent,
        NudeShowPhotoComponent,
        TopModelComponent,
        RecordedVideoComponent,
        AlbumComponent,
        CollectionComponent,
        SweetTreatComponent,
        ModelNewsComponent,
        ModelScheduleComponent,
        UploadPhotoComponent,
        UploadVideosComponent,
        SweetTreatDetailsComponent,
        AlbumDetailsComponent,
        PrivacyPolicyComponent,
        CookiePolicyComponent,        
        NoticeAboutPerformerComponent,
        ComplianceStatementComponent,
        MakeMoreMoneyComponent,
        WhySignupWithUsComponent,
        PerformerDashboardComponent,
        StartStreamingComponent,
        UpdateAccountRecordComponent,
        ModelDashboardComponent,
        TimeAgoPipe,
        PrivateMessageComponent,
        DcmaCompliantFormComponent,
        DcmaCompliantComponent,
        MyFollowersComponent,
        BroadcastScheduleComponent,
        ViewModelProfileComponent,
        SidebarTabsComponent,
        ModelFollowersComponent,
        ModelFollowingsComponent,
        ModelActivityComponent,
    ],
    imports: [
        CommonModule,
        EntryRoutingModule,
        HttpClientModule,
        FormsModule,
        CKEditorModule,
        // NoopAnimationsModule,
        MatDatepickerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatNativeDateModule,
        NgMultiSelectDropDownModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    providers: [AppService, TitleService, UserService, AuthGuard, ChatSocketService, CheckStreamerService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap: [EntryComponent]
})

export class EntryModule { }
  