$.fn.exists = function() {
    return this.length > 0 ? this : false;
};
$(document).ready(function() {
    var App = {
        SidebarAnim: null,
        pageContainer: $("div#main"),
        pages: $("div.page"),
        menuItems: $("ul#navigation"),
        overlay: $("div#overlay"),
        topz: "500",
        apply_post: function($post_html) {
            $("<ul/>", {
                "class": "ul-withdetails",
                html: $post_html.join('')
            }).appendTo("#main #research .pagecontents .col-md-12").find(".row").on('click', function(e) {
                var $title = $(this).find('h3').html();
                var $id_post = $(this).closest('li').prop('id');
                $.ajax({
                    url: 'posts/' + $id_post + '.html',
                    success: function($response) {
                        $('#view_post h3').html($title);
                        $('#view_post .row').html($response);
                    },
                    complete: function() {
                        App.forward($('#view_post'), App.pageContainer.children(".currentpage"));
                    }
                });
            }).on('mouseenter', function() {
                $this = $(this);
                var anim = new TweenLite($(this).closest("li").find(".imageoverlay"), 0.4, {left: 0});
            }).on('mouseleave', function() {
                var anim = new TweenLite($(this).closest("li").find(".imageoverlay"), 0.2, {left: "-102%"});
            });
        },
        template: {
            post: function($title, $summary, $post) {
                return '<li id="' + $post + '">\
                            <div class="row">\
                                <div class="col-sm-6 col-md-3">\
                                    <div class="image">\
                                        <img alt="image" src="images/projects/p3.jpg"  class="img-responsive">\
                                        <div class="imageoverlay">\
                                            <i class="icon icon-search"></i>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="col-sm-6 col-md-9">\
                                    <div class="meta">\
                                        <h3>' + $title + '</h3>\
                                        <p>' + $summary + '</p>\
                                    </div>\
                                </div>\
                            </div>\
                        </li>';
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
                var $phrase_html = [];
                for (var $key in $posts) {
                    var $post = $posts[$key];
                    if ($post.type === 'post') {
                        $post_html.push(App.template.post($post.title, $post.summary, $post.post));
                    } else {
                        $phrase_html.push(App.template.phrase($post.title));
                    }
                }
                App.apply_post($post_html);
            });
        },
        reset: function() {

            this.overlay.hide();

            var $gotop1 = this.pages.not(".home");
            $gotop1.attr('data-pos', 'p1').removeAttr('data-order');
            TweenLite.to($gotop1, 0.4, {left: "100%", zIndex: 0, onComplete: function() {
                    $gotop1.removeClass('currentpage');
                }});

            this.hanndelMenu();
        },
        forward: function(gotop2, /* optional */ gotop3) {
            App.hanndelMenu(gotop2);
            App.overlay.show();
            var maxz = App.maxz();
            gotop2.addClass('currentpage');
            gotop2.attr('data-pos', 'p2').removeAttr('data-order');
            gotop3.attr('data-pos', 'p3').attr('data-order', maxz + 1);
            (new TimelineLite())
                    .set(gotop2, {left: "100%", zIndex: App.topz})
                    .set(gotop3, {zIndex: maxz + 1})
                    .to(gotop2, 0.4, {left: "15%"})
                    .to(gotop3, 0.3, {left: 0, onComplete: function() {
                            gotop3.removeClass('currentpage');
                        }}, "-=0.2");
        },
        backward: function(gotop2, gotop1) {
            this.hanndelMenu(gotop2);
            gotop2.exists() || this.overlay.hide();
            gotop2.addClass('currentpage').removeAttr('data-order').attr('data-pos', "p2");
            gotop1.attr('data-pos', 'p1');
            (new TimelineLite())
                    .set(gotop2, {zIndex: App.topz - 1})
                    .to(gotop2, 0.4, {left: "15%"})
                    .to(gotop1, 0.5,
                            {
                                left: "100%",
                                onComplete: function() {
                                    gotop1.removeClass('currentpage');
                                }
                            }, "-=0.3")
                    .set(gotop1, {zIndex: 0});
        },
        maxz: function() {
            var levelArray = this.pages.map(function() {
                return $(this).attr('data-order');
            }).get();
            maxz = levelArray.length && Math.max.apply(Math, levelArray);
            return maxz;
        },
        hanndelMenu: function() {
            var menuIndex = (arguments.length) ? ((arguments[0].length) ? arguments[0].index() : 0) : 0;
            this.menuItems.children().eq(menuIndex)
                    .addClass('currentmenu')
                    .siblings().removeClass('currentmenu');
        },
        init: function() {
            App.SidebarAnim
                    .to($(".social-icons, #main-nav"), 0.2, {left: 0})
                    .to($("#main"), 0.2, {left: 250, right: "-=250"}, "-=0.2");
            $("a.mobilemenu").on("click", function() {
                App.SidebarAnim.play();
            });
            $("a.mobilemenu").on("click", function() {
                App.SidebarAnim.play();
            });
            $(".social-icons, #main-nav, #main").on("click", function() {
                App.SidebarAnim.reverse();
            });
            App.menuItems.on('click', 'li:not(.external)', function(e) {
                e.preventDefault();
                var $li = $(this),
                        $target = $($li.children('a').attr('href')),
                        currentPosition = $target.attr('data-pos'),
                        $secondary = App.pageContainer.children(".currentpage");
                switch (currentPosition) {
                    case "home" :
                        App.reset();
                        break;
                    case "p1" :
                        App.forward($target, $secondary);
                        break;
                    case "p3" :
                        if (parseInt($target.attr('data-order')) === App.maxz()) {
                            App.backward($target, $secondary);
                        } else {
                            App.forward($target, $secondary);
                        }
                        break;
                    default:
                        return false;
                }
            });
            App.overlay.on('click', function() {
                var $secondary = App.pageContainer.children(".currentpage");
                var $target = App.pageContainer.children("[data-order=" + App.maxz() + "]");
                App.backward($target, $secondary);
            });
            App.get_json();
        }
    };
    $("#main #research .pagecontents .col-md-12").empty();
    App.SidebarAnim = new TimelineLite({paused: true});
    App.reset();
    App.init();
});