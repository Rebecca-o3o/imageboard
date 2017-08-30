(function() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('template');

    Array.prototype.slice.call(templates).forEach(function(tmpl) {
        Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
    });

    Handlebars.partials = Handlebars.templates;


    //------ BACKBONE MODELS ------ //
    var HomeModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch();
            // console.log("MODEL:", this);
        },
        url: '/home'
    });


    var UploadModel = Backbone.Model.extend({
        // initialize: function() {
        //     this.fetch();
        // },
        url: '/upload',
        save: function() {              //overwrite prototype save function
            //get first file used in html form input:
            var file = $('input[type="file"]').get(0).files[0];

            //create FormData:
            var formData = new FormData;

            //attach inputs to formData:
            formData.append('file', file);
            formData.append('title', this.get('title'));
            formData.append('username', this.get('username'));
            formData.append('description', this.get('description'));

            //send FormData in ajax POST request:
            var model = this;
            $.ajax({
                url: this.url,
                method: 'POST',
                data: formData,
                processData: false,         //prevent jQuerys usuall process
                contentType: false,         //prevent jQuerys usuall process
                success: function() {
                    model.trigger("upload Success!");
                }
            });
        }
    });

    // ------ BACKBONE VIEWS ------ //
    var HomeView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            // console.log("VIEW", this);
            this.model.on('change', function() {
                view.render();
            });
        },
        render: function() {
            var data = this.model.toJSON();
            //ref to .html template id=images
            var html = Handlebars.templates.images(data);
            this.$el.html(html);
        }
    });


    var UploadView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            //ref to .html template id=upload
            this.$el.html(Handlebars.templates.upload({}));
        },
        events: {
            'click button': function(e) {
                this.model.set({
                    file: this.$el.find('input[type="file"]').prop('files')[0],
                    title: this.$el.find('input[name="title"]').val(),
                    username: this.$el.find('input[name="username"]').val(),
                    description: this.$el.find('input[name="description"]').val()
                }).save();                  //overwritten save function
            }
        }
    });

    // var ImageView = Backbone.View.extend({
    //     render: function() {
    //         //ref to .html template id=upload
    //         this.$el.html(Handlebars.templates.img(this.model.toJSON()));
    //         new PostACommentView();
    //     }
    // });

    // var imageView = new ImageView({
    // }).on('ready', function(){
    //     new PostACommentView({
    //         el: '#post-a-comment',
    //         model: new PostACommentModel({ imageId: id})
    //     })
    // });


    // ------ BACKBONE ROUTER ------ //
    //optional monkey patching replacing old function and adding el.off
    // var oldSetElement = Backbone.View.prototype.setElement;
    // // function runs automatically
    // Backbone.View.prototype.setEmelemnt = function(el) {
    //     $(el).off();
    //     oldSetElement.call(this.el);
    // };

    var Router = Backbone.Router.extend({
        routes:{
            'image/:id': 'image',
            'upload': 'upload',
            'home': 'home',
            '': 'home'
        },
        home: function(){
            new HomeView({
                el: '#main',
                model: new HomeModel
            });
            // $('#main').off();
        },
        upload: function() {
            $('#main').off();  // removes still existing main element when in upload view
            new UploadView({
                el: '#main',
                model: new UploadModel
            });
        },
        // image: function(id){
        //
        // },
    });

    var router = new Router;

    Backbone.history.start();

})();
