(function() {

    Handlebars.registerHelper('each', function(context, options) {
        var ret = "";

        for(var i=0, j=context.length; i<j; i++) {
            ret = ret + options.fn(context[i]);
        }

        return ret;
    });

    var prosvObj = new ProsvClass;
    
    //Пагинация на странице с вебинарами
    var setPagination = function(){

        var PageType = {
            "next": "2",
            "prev": "1",
            "type": '',
            "selector": '',
            "pageCount": "1",
            "currentPage": "1"
        };

        this.init = function(typeOfPage, pageCount){
            SetPageType(typeOfPage, pageCount);
            setElementsHandler();
        };

         var SetPageType = function(typeOfPage, pageCount){
            PageType.type = typeOfPage;
            PageType.selector = typeOfPage + "-tab";
            PageType.pageCount = pageCount;
            setCurrentElement();
        };

        var setElementsHandler = function(){
            var webinarPagination = document.querySelectorAll(PageType.selector + ' .webinars-pagination a');
            for (var page = 0; page < webinarPagination.length; page++) {
                var webinarPaginationElement = webinarPagination[page];
                webinarPaginationElement.addEventListener('click', function (event) {
                    event.preventDefault();
                    for (var item = 0; item < webinarPagination.length; item++) {
                        var webinarPaginationItem = webinarPagination[item];
                        webinarPaginationItem.className = '';
                    }
                    setPageData(this);
                });
            }
        };

        var setCurrentElement = function(){
            var webinarPagination = document.querySelectorAll(PageType.selector + ' .webinars-pagination a');
            for (var page = 1; page <= webinarPagination.length; page++) {
                if(page === Number(PageType.currentPage)){
                    var webinarPaginationElement = webinarPagination[page];
                    webinarPaginationElement.className = 'current';
                }
            }
        };

        var setPageData = function(obj){
            var page = obj.dataset.page;
            if(obj.dataset.page === "prev"){page = PageType.prev;}
            if(obj.dataset.page === "next"){page = PageType.next;}

            if(obj.dataset.page !== "prev" && obj.dataset.page !== "next"){
                obj.className = 'current';
            }

            if(PageType.currentPage === page) {
                setCurrentElement();
                return false;
            } else {
                PageType.currentPage = page;
                setCurrentElement();
            }

            PageType.prev = (Number(page) -1).toString();
            PageType.next = (Number(page) +1).toString();

            if(page === "1"){PageType.prev = "1";}
            if(page === PageType.pageCount){PageType.next = PageType.pageCount;}

            var data = {
                "type": obj.dataset.type,
                "page": page,
                "spec": specialisation_filtr_str
            };
            $.ajax({
                type: "POST",
                url: "/webinars_api",
                data: data,
                success: function(result){
                    renderHtml(result,'#' + data.type + '-tab .article-list');
                }
            });
        };

        var renderHtml = function(data, selector){
            var webinar = document.getElementById("webinarTMP");
            var webinar_tmp = webinar.innerHTML;
            var webinar_compile = Handlebars.compile(webinar_tmp);
            var webinar_content = document.querySelector(selector);
            var json_result = JSON.parse(data);

            webinar_content.innerHTML = '';

            for (var item = 0; item < json_result.length; item++) {
                var webinar_html = webinar_compile(json_result[item]);
                console.log(webinar_html);
                webinar_content.innerHTML += webinar_html;
            };

            document.body.scrollTop = document.documentElement.scrollTop = 120;
        };

    };

    if(prosvObj.isObjExist('.webinars-pagination')) {
        var FuturePagination = new setPagination();
        FuturePagination.init('#future',FuturePagesCount);

        var ArchivePagination = new setPagination();
        ArchivePagination.init('#archive',ArchivePagesCount);
    }

})();
