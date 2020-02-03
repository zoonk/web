import { Dictionary } from './misc';

export type UILanguage = 'en' | 'pt';

export type TranslationKeys =
  | 'about_list'
  | 'about_me'
  | 'add_image'
  | 'admin'
  | 'advanced'
  | 'after'
  | 'already_have_account'
  | 'already_logged_in'
  | 'back_to_login'
  | 'before'
  | 'beginner'
  | 'by'
  | 'cancel'
  | 'chapter_add'
  | 'chapter_edit'
  | 'chapter_invalid_id'
  | 'chapter'
  | 'chapters'
  | 'choose_language'
  | 'close'
  | 'comment_leave'
  | 'comment_login_required'
  | 'comments_count'
  | 'comments'
  | 'confirm'
  | 'confirmation'
  | 'contact_us'
  | 'content'
  | 'create'
  | 'created_on'
  | 'created'
  | 'creating_account'
  | 'current_item'
  | 'delete_confirmation'
  | 'delete'
  | 'deleted'
  | 'deleting'
  | 'description'
  | 'done'
  | 'dont_have_account'
  | 'edit_history'
  | 'edit_not_allowed'
  | 'edit_page'
  | 'edit_profile'
  | 'edit_topic'
  | 'edit'
  | 'edited_on'
  | 'email'
  | 'error_action'
  | 'examples'
  | 'expert'
  | 'feedback'
  | 'field_required'
  | 'file_too_big'
  | 'forgot_password'
  | 'formatting_bold_example'
  | 'formatting_bold'
  | 'formatting_code_inline_example'
  | 'formatting_code_inline'
  | 'formatting_code_multiline_example'
  | 'formatting_code_multiline'
  | 'formatting_header_example'
  | 'formatting_header'
  | 'formatting_image_example'
  | 'formatting_image'
  | 'formatting_italic_example'
  | 'formatting_italic'
  | 'formatting_link_example'
  | 'formatting_link'
  | 'formatting_ol_example'
  | 'formatting_ol'
  | 'formatting_quote_example'
  | 'formatting_quote'
  | 'formatting_tips'
  | 'formatting_ul_example'
  | 'formatting_ul'
  | 'formatting_vimeo_example'
  | 'formatting_vimeo'
  | 'formatting_youtube_example'
  | 'formatting_youtube'
  | 'forum'
  | 'go_back'
  | 'go_home'
  | 'having_issues'
  | 'home'
  | 'items_empty'
  | 'leaderboard'
  | 'learn_about'
  | 'learningPaths'
  | 'let_us_know'
  | 'lessons'
  | 'level'
  | 'like'
  | 'liked'
  | 'likes_count'
  | 'link'
  | 'load_more'
  | 'login_required'
  | 'login'
  | 'logout'
  | 'menu'
  | 'message'
  | 'my_notes'
  | 'my_studies'
  | 'name'
  | 'need_to_be_loggedin'
  | 'notes_first'
  | 'notes_new'
  | 'notes_required_fields'
  | 'notifications'
  | 'order'
  | 'page_edits_title'
  | 'page_edits'
  | 'page_list'
  | 'password_change'
  | 'password_new'
  | 'password_old'
  | 'password'
  | 'path_add'
  | 'path_edit'
  | 'path'
  | 'paths'
  | 'photo_update'
  | 'photo_uploaded'
  | 'photo'
  | 'post_add'
  | 'post_edit'
  | 'posts'
  | 'premium'
  | 'preview'
  | 'preview_quit'
  | 'privacy_policy'
  | 'pro'
  | 'profile'
  | 'questions'
  | 'read_wikipedia'
  | 'real_life_examples'
  | 'references'
  | 'replies'
  | 'report_confirmation'
  | 'report_issue'
  | 'report_progress'
  | 'report_success'
  | 'report_tooltip'
  | 'report'
  | 'reports'
  | 'reset_password_sending'
  | 'reset_password_sent'
  | 'reset_password'
  | 'response_deleted'
  | 'revert_confirmation'
  | 'revert_progress'
  | 'revert_success'
  | 'revert_tooltip'
  | 'revert'
  | 'save_changes'
  | 'save'
  | 'saved_limit_reached'
  | 'saved_no_items'
  | 'saved'
  | 'saving'
  | 'search_ph'
  | 'search_topic_help'
  | 'search_topic_not_found'
  | 'search_topic'
  | 'search'
  | 'see_all_edits'
  | 'see_all'
  | 'selected_item'
  | 'send'
  | 'sending'
  | 'sent'
  | 'seo_contact_desc'
  | 'seo_edits_desc'
  | 'seo_examples_desc'
  | 'seo_home_desc'
  | 'seo_home_title'
  | 'seo_learningPaths_desc'
  | 'seo_login_desc'
  | 'seo_notes_desc'
  | 'seo_posts_desc'
  | 'seo_profile_desc'
  | 'seo_profile_paths_desc'
  | 'seo_profile_paths_title'
  | 'seo_profile_posts_desc'
  | 'seo_profile_posts_title'
  | 'seo_profile_topics_desc'
  | 'seo_profile_topics_title'
  | 'seo_ref_desc'
  | 'seo_reset_password_desc'
  | 'seo_search_desc'
  | 'seo_search_title'
  | 'seo_settings_desc'
  | 'seo_signup_desc'
  | 'seo_studies_desc'
  | 'seo_studies_title'
  | 'seo_topic_desc'
  | 'seo_topic_examples_desc'
  | 'seo_topic_examples_title'
  | 'seo_topic_paths_desc'
  | 'seo_topic_paths_title'
  | 'seo_topic_posts_desc'
  | 'seo_topic_posts_title'
  | 'seo_topic_refs_desc'
  | 'seo_topic_refs_title'
  | 'seo_topics_create_desc'
  | 'seo_topics_desc'
  | 'settings'
  | 'signin_facebook'
  | 'signin_google'
  | 'signing_in'
  | 'signup_notice_and'
  | 'signup_notice'
  | 'signup'
  | 'social_description'
  | 'subscribe_free_desc'
  | 'subscribe_free_price'
  | 'subscribe_free_title'
  | 'subscribe_premium_btn'
  | 'subscribe_premium_desc'
  | 'subscribe_premium_price'
  | 'subscribe_premium_title'
  | 'subscribe_success_desc'
  | 'subscribe_success_title'
  | 'subscription'
  | 'terms_service'
  | 'text'
  | 'title_required'
  | 'title'
  | 'topic_create_desc'
  | 'topic_create'
  | 'topic_selector_helper'
  | 'topics'
  | 'updated'
  | 'upgrade_desc'
  | 'upgrade_premium'
  | 'upgrade_title'
  | 'uploading'
  | 'url'
  | 'username_exists'
  | 'username'
  | 'video'
  | 'video_link'
  | 'view'
  | 'year';

export type TranslationData = {
  [key in TranslationKeys]: string;
};

export type TranslationFn = (
  key: TranslationKeys,
  args?: Dictionary<string | number>,
) => string;
