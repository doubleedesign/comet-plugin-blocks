<?php
use Doubleedesign\Comet\Core\{Callout, Paragraph};

if (!current_user_can('edit_posts')) {
    wp_safe_redirect(home_url());
    exit;
}

wp_head();

$callout = new Callout(
    [],
    [new Paragraph([], 'You are viewing a preview of a shared content item. This view is only visible to logged-in site editors.')]
);
$callout->render();

the_content();

wp_footer();
