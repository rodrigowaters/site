var App = {
    template: {
        post: function($title, $summary, $hash) {
            return '<div class="home_single_post">\
                        <div class="post_content_area">\
                            <div class="row">\
                                <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">\
                                    <div class="single_post_content">\
                                        <h2><a href="#posts/' + $hash + '.html">' + $title + '</a></h2>\
                                        <p>' + $summary + '</p>\
                                        <a href="#posts/' + $hash + '.html">Ler mais <span>&rarr;</span></a>\
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
                                            <h2><sup>&ldquo;</sup>' + $phrase + '<sup>&rdquo;</sup></h2>\
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
                    $post_html.push(App.template.post($post.title, $post.summary, $post.hash));
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
            var $hash = (window.location.hash).replace('#', '');
            if ($.trim($hash)) {
                $.ajax({
                    url: $hash,
                    beforeSend: function() {
                        $('#modal .modal-conten').empty();
                    },
                    success: function($response) {
                        $('#modal .modal-content').addClass('home_page_post_area').html($response);
                    },
                    complete: function() {
                        $('#modal').modal('show');
                    }
                });
            }
        });
        App.get_json();
        $('#modal').on('hidden.bs.modal', function(e) {
            var $hash = window.location.hash;
            window.location.hash = '';
            window.location.hash = $hash;
        });
    }
};
$(document).ready(function() {
    window.location.hash = '';
    App.init();
});