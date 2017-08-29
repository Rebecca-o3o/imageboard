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
    var homeModel = new HomeModel;


    var UploadModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch();
        },
        url: '/upload',
        save: function() {              //overwrite save function
            //get first file used in html form input:
            var file = $('input[type="file"]').get(0).files[0];

            //create FormData:
            var formData = new FormData;

            //attach file and img title to formData:
            formData.append('file', file);
            formData.append('title', this.get('title'));

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
                    title: this.$el.find('input[name="title"]').val(),
                    file: this.$el.find('input[type="file"]').prop('files')[0]
                }).save();                  //overwritten save function
            }
        }
    });

    // ------ Route handlers ------ //
    var homeView = new HomeView({
        model: new HomeModel(),
        el: '#main'
    });
    // var uploadView = new UploadView({
    //     model: new UploadModel(),
    //     el: '#main'
    // });

    // ------ BACKBONE ROUTER ------ //
    var Router = Backbone.Router.extend({
        routes:{
            // 'image/:id': 'image',
            'upload': 'upload',
            '': 'home'
        },
        home: function(){
            homeView.render();
        },
        // upload: function() {
        //     uploadView.render();
        // }
        upload: function() {
            new UploadView({
                el: '#main',
                model: new UploadModel
            });
        }
    });

    var router = new Router;

    Backbone.history.start();

})();
