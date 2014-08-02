var App = {
    template: {
        post: function($title, $summary) {
            return '<div class="home_single_post">\
                        <div class="post_content_area">\
                            <div class="row">\
                                <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">\
                                    <div class="single_post_content">\
                                        <h2><a href="#">' + $title + '</a></h2>\
                                        <p>' + $summary + '</p>\
                                        <a href="#">Ler mais <span>&rarr;</span></a>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        },
        phrase: function($phrase) {
            return '<div class="home_single_post">\
                        <div class="post_content_area">\
                            <div class="row">\
                                <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">\
                                    <div class="single_post_content">\
                                        <div class="sinle_blockquote">\
                                            <h2><a href="#"><sup>&ldquo;</sup>' + $phrase + '<sup>&rdquo;</sup></a></h2>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        }
    },
    get_json: function() {
        $.getJSON('posts.json', {}, function($posts) {
            var $post_html = [];
            for (var $key in $posts) {
                var $post = $posts[$key];
                if ($post.type === 'post') {
                    $post_html.push(App.template.post($post.title, $post.summary));
                } else {
                    $post_html.push(App.template.phrase($post.title));
                }
            }
            $("<div/>", {
                "class": "col-md-12",
                html: $post_html.join('')
            }).appendTo("section.home_page_post_area div.container div.row");
        });
    },
    init: function() {
        $(window).on('hashchange', function() {
            
        });
        App.get_json();
    }
};
$(document).ready(function() {
    window.location.hash = '';
    App.init();
});