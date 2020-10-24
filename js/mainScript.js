var loginValidator = null;
var spType = "";
var ws = null;
$(document).ready(function() {
  checkLogged();

  localStorage.sp = JSON.stringify({EmplID: "superadmin"});
  ws = new ReconnectingWebSocket("a.d.m");
  setTimeout(function() {

    var firebaseConfig = {
      apiKey: "AIzaSyCyqcy5IoOZJ-EMPg8LzqAqbBlSCfRXEPg",
      authDomain: "costerdiamonds-35fd1.firebaseapp.com",
      databaseURL: "https://costerdiamonds-35fd1.firebaseio.com",
      projectId: "costerdiamonds-35fd1",
      storageBucket: "costerdiamonds-35fd1.appspot.com",
      messagingSenderId: "761157246234",
      appId: "1:761157246234:web:0efe71b7e4e61b6869a0a3"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
           const messaging = firebase.messaging();
           // Add the public key generated from the console here.
           messaging.usePublicVapidKey("BNtoiIGz0sRpesKyu-IZaLBH3fDOEYXqzhs254DwypSRAXSkUYOTjXOg36Hb8-7abJ0QBL0USJ45mxAd25tXeXc");
           console.log(messaging)
           messaging.requestPermission()
           .then(function() {
             return messaging.getToken();
           })
           .then(function(token) {
              registerToken(token);
           })
           .catch(function(err) {
             alert(err);
           })
   }, 5000);
})
function registerToken(token) {

  $.ajax({
    url: "https://costercatalog.com:4000",
    type: "POST",
    data: JSON.stringify({ action: "registerToken", token : token}),
    success: function(res) {

    }
  })
}
function checkLogged() {
  if (localStorage.user === undefined || localStorage.user == "undefined") {
      showModal({
        title: 'Login',
        allowBackdrop: false,
        showClose: false,
        showCancelButton: false,
        noclose: true,
        addToContent: ".loginForm",
        onOpen: function() {

          if (loginValidator == null) {
            loginValidator = $( "#loginForm" ).validate({
              rules: {
                username: {
                  required: true
                },
                password: {
                  required: true
                }
              },
              submitHandler: function(form) {
                api.call("chackAdmin", function(res) {
                  if (res.length == 0) {
                    $("#logerror").show();
                  } else {
                    $("#mainModal").modal("hide");
                    localStorage.user = JSON.stringify(res[0]);
                    $("#un").html(res[0].name);
                    showModal({
                      title: "Welcome back " + res[0].name,
                      showCancelButton: false,
                      confirmButtonText: "CONTINUE"
                    })

                    preparePage();
                  }
                }, {username: $("#username").val(), password: $("#password").val() }, {}, {});
              }
            });
          }
        },
        confirmCallback: function() {
            $("#loginForm").submit();
        }
      })
   } else {
     var u = $.parseJSON(localStorage.user);
     $("#un").html(u.name);
     showModal({
       title: "Welcome back " + u.name,
       showCancelButton: false,
       confirmButtonText: "CONTINUE"
     })
       preparePage();
   }
}
showModal = function(options = {}) {
  if (options.type === undefined) {
    $("#m_header").css({
      backgroundImage: "url(images/crown.png)"
    })
  }
  if (options.type == "error") {
    $("#m_header").css({
      backgroundImage: "url(images/error.png)"
    })
  }
  if (options.type == "ok") {
    $("#m_header").css({
      backgroundImage: "url(images/green_checkbox_only.png)"
    })
  }
  if (options.title !== undefined) {
    $("#m_title").html(options.title);
  }
  if (options.content !== undefined) {
    $("#m_content").html(options.content);
  } else {
      $("#m_content").html("");
  }
  if (options.showCancelButton !== undefined) {
    $("#m_cancel").hide();
  } else {
    $("#m_cancel").show();
  }
  if (options.confirmButtonText !== undefined) {
    $("#m_confirm").html(options.confirmButtonText);
  } else {
    $("#m_confirm").html("CONFIRM");
  }
  if (options.cancelButtonText !== undefined) {
    $("#m_cancel").html(options.cancelButtonText);
  } else {
    $("#m_cancel").html("CANCEL");
  }
  $("#m_confirm").unbind("click");

  if (options.confirmCallback !== undefined) {
    $("#m_confirm").bind("click", function() {
      options.confirmCallback();
      if (options.noclose === undefined) {
        $('#mainModal').modal("hide");
      }
    });
  } else {
    $("#m_confirm").bind("click", function() {
      if (options.noclose === undefined) {
        $('#mainModal').modal("hide");
      }
    });
  }
  if (options.cancelCallback === undefined) {
    $("#m_cancel").bind("click", function() {
      if (options.noclose === undefined) {
        $('#mainModal').modal("hide");
      }
    });
  } else {
    $("#m_cancel").bind("click", function() {
      options.cancelCallback();
      if (options.noclose === undefined) {
        $('#mainModal').modal("hide");
      }
    });
  }
  setTimeout(function() {
      if (options.showClose !== undefined) {
         $('#mainModal').find(".close").hide();
      } else {
        $('#mainModal').find(".close").show();
      }
  }, 1000);
  if (options.allowBackdrop !== undefined) {
    $('#mainModal').modal({
      backdrop: 'static',
      keyboard: false
    })
  } else {
    $('#mainModal').modal({
      backdrop: true,
      keyboard: true
    })
  }
  if (options.addToContent !== undefined) {
    var dv = $(options.addToContent).clone().appendTo($("#m_content"));
    $("#mainModal").find(options.addToContent).show();
    $("#mainModal").find(options.addToContent).attr("id",options.addToContent.substring(1));
  }
  if (options.onOpen !== undefined) {
    options.onOpen();
  }
  $("#mainModal").modal("show");
}
function loadPage(page) {
  $("section").hide();
  $("#" + page).show();
  if (page == "admins") {
    drawSPChart(spType);
  }
}
var invoiceTable = null;
var customerTable = null;
var logsTable = null;
$.fn.dataTable.ext.order['numeric_value'] = function  ( settings, col )
{
  return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
        if ($('realvalue', td).attr("realvalue") !== undefined) {
          return $('realvalue', td).attr("realvalue") * 1;
        } else {
          return 0;
        }
    } );

};
function preparePage() {

  invoiceTable = $("#invoicesTable").DataTable({
      ajax: {
          "url": "https://costercatalog.com/api/index.php?request=allinvoices"
      },
       "order": [[ 0, "desc" ]],
         "paging": false,
         columns: [
                { "data": "date" ,

                  "render" : function ( data, type, row )  {
                 //   return moment(data).format("dd.mm.yyyy");

                   return data;
                }},
                { "data": "invoiceid",   "render": function ( data, type, row ) {

                     var str = "9" + data.toString().padStart(5, "0") + ((row["version"] != null) ? row["version"] : "");
                     if (row["reference"] != "") {
                        str += "<br />Ref. No." + row["reference"];
                     }
                     return str;
                 }},
                 { data: "pdf",
                     "defaultContent": "",
                     "render": function ( data, type, row ) {
                       var cs = "openPDF('" + data + "');";
                       html = '<div style="width:150px;min-width:150px;"><a class="gen-link" onclick=' + cs + ' ><i class="fa fa-file-pdf-o fa-2x m-r-5"></i></a>';
                       html += '&nbsp;&nbsp;<a unlock class="gen-link"><i class="fa fa-unlock fa-2x m-r-5"></i></a><a lock class="gen-link"><i class="fa fa-lock fa-2x m-r-5"></i></a>';
                       html += "</div>"
                       return html;
                     }
                   },
                { "data": "customer" },
                { "data": "tourNo" },
                { "data": "touroperater" },
                 { "data": "showroom" },
                 { "data": "salesPerson" },
                  { "data": "discountApprovedName" },
                 { "data": "startingTotal",
                  "defaultContent": "",
                  "orderDataType": "numeric_value",
                  "render": function ( data, type, row ) {
                    var html = "<realvalue realvalue='" + data + "'>" + parseFloat(data).toLocaleString("nl-NL",{ style: 'currency', currency: "EUR" }) + "</realvalue>";
                     return html;
                 }},
                 { "data": "discount",
                 "defaultContent": "",
                 "orderDataType": "numeric_value",
                 "type": "numeric",
                 "render": function ( data, type, row ) {
                    return data;

                }},
                { "data": "due",
                "orderDataType": "numeric_value",
                "type": "numeric",
                  "render" : function(data, type, row) {
                  return data;
                }},

               { "data": "status"},
               { "data": "version"},
              { "data": "locked"},
              { "data": "reference"},
              { "data": "currentdue"},
                { "data": "hasDicount"}

            ],
            "drawCallback": function(settings) {
              $.each($("#invoices").find("tbody").find("tr"), function(ind) {
            //    alert($(this).find("td").eq(11).html())
                if ($(this).find("td").eq(12).html() == "1") {
            //      alert("here")
                  $(this).find("[ok]").hide();
                  $(this).find("[void]").show();
                  $(this).css({
                    opacity: 1
                  })
                } else {
                  $(this).find("[ok]").show();
                  $(this).find("[void]").hide();
                  $(this).css({
                    opacity: 0.6
                  })
                }
                if ($(this).find("td").eq(14).html() == "1") {
            //      alert("here")
                  $(this).find("[unlock]").hide();
                  $(this).find("[lock]").show();
                } else {
                  $(this).find("[unlock]").show();
                  $(this).find("[lock]").hide();
                }
              });
              $("[void]").unbind("click");
              $("[void]").bind("click", function() {
                var rw = invoiceTable.row($(this).closest("tr"));
                var dt = rw.data();
                var nd = rw.node();
                $(nd).find("[void]").hide();
                $(nd).find("[ok]").show();
                $(nd).css({
                  opacity: 0.6
                })
                dt.status = "0";

                api.call("setInvoiceStatus", function(res) {

                }, {invoiceid: dt.invoiceid, status: "0" }, {},{})
              })
              $("[ok]").unbind("click");
              $("[ok]").bind("click", function() {
                var rw = invoiceTable.row($(this).closest("tr"));
                var dt = rw.data();
                var nd = rw.node();
                $(nd).find("[void]").show();
                $(nd).find("[ok]").hide();
                $(nd).css({
                  opacity: 1
                })
                dt.status = "1";
                api.call("setInvoiceStatus", function(res) {

                }, {invoiceid: dt.invoiceid, status: "1" }, {},{})
              })
              $("[lock]").unbind("click");
              $("[lock]").bind("click", function() {
                var rw = invoiceTable.row($(this).closest("tr"));
                var dt = rw.data();
                var nd = rw.node();
                $(nd).find("[unlock]").show();
                $(nd).find("[lock]").hide();

                dt.locked = "0";

                api.call("setInvoiceLocked", function(res) {

              }, {invoiceid: dt.invoiceid, locked: "0" }, {},{})
              })
              $("[unlock]").unbind("click");
              $("[unlock]").bind("click", function() {
                var rw = invoiceTable.row($(this).closest("tr"));
                var dt = rw.data();
                var nd = rw.node();
                $(nd).find("[lock]").show();
                $(nd).find("[unlock]").hide();
                dt.locked = "1";
                api.call("setInvoiceLocked", function(res) {

            }, {invoiceid: dt.invoiceid, locked: "1" }, {},{})
              })
            },
            dom: 'Bfrtip',
             buttons: [

             ]
   });
   setTimeout(function() {
        invoiceTable.columns.adjust().draw();
   }, 2000)
   yadcf.init(invoiceTable, [{
     column_number: 0,
       filter_type: "range_date",
       date_format: 'yyyy-mm-dd',
       moment_date_format: 'YYYY-MM-DD',
       filter_delay: 500,
        filter_container_id: "t_0"
     },
     {
       column_number: 1,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_1"
     },
     {
         column_number: 14,
         filter_type: 'custom_func',
         custom_func: searchLocked,
         data: [{
             value: '-1',
             label: 'All'
         }, {
             value: '0',
             label: 'Unlocked'
         }, {
             value: '1',
             label: 'Locked'
         }],
         filter_default_label: "Locked/unlocked",
          filter_container_id: "t_2"
     },
     {
         column_number: 16,
         filter_type: 'custom_func',
         custom_func: searchDue,
         data: [{
             value: '0',
             label: 'Completed'
         }, {
             value: '1',
             label: 'Due'
         }],
         filter_default_label: "Is Due",
          filter_container_id: "t_3"
     },
     {
         column_number: 17,
         filter_type: 'custom_func',
         custom_func: searchDiscount,
         data: [{
             value: '0',
             label: 'No discount'
         }, {
             value: '1',
             label: 'Discaunt'
         }],
         filter_default_label: "Discount",
          filter_container_id: "t_discount"
     },
     {
       column_number: 3,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_4"
     },
     {
       column_number: 4,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_5"
     },
     {
       column_number: 5,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_6"
     },
     {
       column_number: 6,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_7"
     },
     {
       column_number: 7,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_8"
     },
     {
       column_number: 8,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "t_9"
     },
  ]);
  yadcf.exFilterColumn(invoiceTable, [
    [14, "1"]
  ]);
  customerTable = $("#customersT").DataTable({
        ajax: {
            "url": "https://costercatalog.com/api/index.php?request=allCustomers",
              type: "POST"
        },
        "paging": false,
         "order": [[ 0, "desc" ]],
        columns: [
             { "data": "customerid" },
             { "data": "name" },
              { "data": "email" },
              { "data": "country" },
              { "data": "countryCode" },
              { "data": "telephone" },
              { "data": "TourNo" },
              { "data": "touroperater" },
              { "data": "address1" }
         ],
        dom: 'Bfrtip',
        buttons: [

        ]
   });
   yadcf.init(customerTable, [ {
       column_number: 1,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "tt_1"
   }, {
       column_number: 2,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "tt_2"
      }, {
       column_number: 3,
       filter_container_id: "tt_3"
   }, {
       column_number: 4,
       filter_container_id: "tt_4"
   },
   {
      column_number: 5,
      filter_type: "auto_complete",
      text_data_delimiter: ",",
      filter_container_id: "tt_5"
  },
    {
       column_number: 6,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
       filter_container_id: "tt_6"
   },


   {
    column_number: 7,
    filter_type: "auto_complete",
    text_data_delimiter: ",",
      filter_container_id: "tt_7"

    },
    {
       column_number: 8,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "tt_8"
      },
  ]);

  logsTable = $("#logsT").DataTable({
        ajax: {
            "url": "https://costercatalog.com/api/index.php?request=getlogs",
              type: "POST"
        },
        "paging": false,
         "order": [[ 0, "desc" ]],
        columns: [
             { "data": "datetime" },
             { "data": "emplid" },
              { "data": "name" },
              { "data": "deviceid" },
              { "data": "ipaddress" },
              { "data": "activity" },

         ],
        dom: 'Bfrtip',
        buttons: [

        ]
   });
   yadcf.init(logsTable, [
    {
      column_number: 0,
      filter_type: "range_date",
      date_format: 'yyyy-mm-dd',
      moment_date_format: 'YYYY-MM-DD',
      filter_delay: 500,
       filter_container_id: "ttt_0"
    },{
       column_number: 2,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "ttt_2"
      },

    {
      column_number: 3,
      filter_type: "auto_complete",
      text_data_delimiter: ",",
      filter_container_id: "ttt_3"
  },
    {
       column_number: 4,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
       filter_container_id: "ttt_4"
   },
   {
      column_number: 5,
      filter_type: "auto_complete",
      text_data_delimiter: ",",
      filter_container_id: "ttt_5"
  },


  ]);

  systemlogsTable = $("#systemlogsT").DataTable({
        ajax: {
            "url": "https://costercatalog.com/api/index.php?request=getsystemlogs&sync=1",
              type: "POST"
        },
        "paging": false,
         "order": [[ 0, "desc" ]],
        columns: [
             { "data": "datetime" },
             { "data": "name" },
              { "data": "activity" },


         ],
        dom: 'Bfrtip',
        buttons: [

        ]
   });
   yadcf.init(systemlogsTable, [
    {
      column_number: 0,
      filter_type: "range_date",
      date_format: 'yyyy-mm-dd',
      moment_date_format: 'YYYY-MM-DD',
      filter_delay: 500,
       filter_container_id: "tttt_0"
    },{
       column_number: 1,
       filter_type: "auto_complete",
       text_data_delimiter: ",",
         filter_container_id: "tttt_1"
      },

    {
      column_number: 2,
      filter_type: "auto_complete",
      text_data_delimiter: ",",
      filter_container_id: "tttt_2"
  }


  ]);
  actualSalesTable = $("#actualsalesT").DataTable({
        ajax: {
            "url": "https://costercatalog.com/api/actualsales.php",
              type: "POST"
        },
        "paging": true,
        "processing": false,
        "serverSide": true,
        "deferRender": true,
         "pageLength": 10,
         "order": [[ 0, "desc" ]],
         "drawCallback": function(settings) {
           $.each($("#actualsalesT").find("tbody").find("tr"), function() {
             var type = $(this).find("td").eq(5).html();

             var cl = "";
             var cll = "black";
             if (type == "0") {
                cl = "#06e411";
              }
              if (type == "1") {
                cl = "#dbe807";
              }
              if (type == "3") {
                cll = "white";
                cl = "#ff0000";
              }
              if (type == "0") {
                $(this).find("td").eq(2).html($(this).find("td").eq(2).html());

               }
               if (type == "1") {
                 $(this).find("td").eq(2).html($(this).find("td").eq(4).html());

                }
                if (type == "3") {
                   $(this).find("td").eq(2).html($(this).find("td").eq(3).html());
                }
             $(this).css({
               backgroundColor: cl,
               color: cll
             })
           })
         },
        "columns": [
             { "data": "TransDate" },
             { "data": "general",
              "render" : function ( data, type, row )  {
              //   return moment(data).format("dd.mm.yyyy");
                  return (data);
               }},
                {"data": "Customer"},
               {"data": "ProjectDetails"},
               {"data": "PrivateDetails"},
               {"data": "type"}

         ],
        dom: 'Bfrtip',
        buttons: [

        ]
   });
  errorsTable = $("#errorsT").DataTable({
        ajax: {
            "url": "https://costercatalog.com/api/index.php?request=geterrors",
              type: "POST"
        },
        "paging": false,
         "order": [[ 0, "desc" ]],
        columns: [
             { "data": "date" },
             { "data": "error",
              "render" : function ( data, type, row )  {
              //   return moment(data).format("dd.mm.yyyy");
                  return atob(data);
               }}
         ],
        dom: 'Bfrtip',
        buttons: [

        ]
   });

   yadcf.init(errorsTable, [
    {
      column_number: 0,
      filter_type: "range_date",
      date_format: 'yyyy-mm-dd',
      moment_date_format: 'YYYY-MM-DD',
      filter_delay: 500,
       filter_container_id: "ttttt_0"
    }
  ]);
  setTimeout(function() {
      $("#invoices").hide();
      $("#customers").hide();
      $("#logs").hide();
        $("#errorslog").hide();
        $("#systemlogs").hide();
      $("#admins").show();
      var vw = setInterval(function() {
        console.log(google.charts )
        if (google.charts !== undefined) {
          clearInterval(vw);
          drawSPChart();
        }
      }, 1000);
    }, 2000);
}
function refreshTables() {
  logsTable.ajax.reload();
  customerTable.ajax.reload();
  invoiceTable.ajax.reload();
  errorsTable.ajax.reload();
}
function openPDF(data) {

  $.ajax({
   url: "https://costercatalog.com/api/invoice.php?invoice=" + data,
   type: "GET",
   success: function(res) {
     var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
      var blob = b64toBlob(res, "application/pdf");
      var blobUrl = URL.createObjectURL(blob);
      if (!app) {
       window.open(blobUrl, "_system","location=yes");

      } else {
        var storageLocation = "";
         storageLocation = 'file:///storage/emulated/0/';
         var folderpath = storageLocation + "Download";
         var filename = "invoice.pdf";
         var DataBlob = b64toBlob(res, "application/pdf");

        window.resolveLocalFileSystemURL(folderpath, function(dir) {
          dir.getFile(filename, {create:true}, function(file) {
                  file.createWriter(function(fileWriter) {
                      fileWriter.write(DataBlob);
                      setTimeout(function() {

                  cordova.plugins.fileOpener2.open(
                      "file:///storage/emulated/0/Download/invoice.pdf",
                      "application/pdf",
                      {
                          error : function(){ },
                          success : function(){ }
                      }
                  );
                }, 500);
                  }, function(err){
                    // failed
                alert(JSON.stringify(err));
                  });
          });
        });
      //  DownloadToDevice("http://costercatalog.com:81/api/invoice.php?invoice=" +  nm + "_" + "gb" + ".pdf");
      }

      //  window.open("http://costercatalog.com:81/api/invoice.php?invoice=" +  data, '_system');
   }
 })
 }
 var b64toBlob = (b64Data, contentType='application/pdf', sliceSize=512) => {
   var byteCharacters = atob(b64Data);
   var byteArrays = [];

   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
     var slice = byteCharacters.slice(offset, offset + sliceSize);

     var byteNumbers = new Array(slice.length);
     for (var i = 0; i < slice.length; i++) {
       byteNumbers[i] = slice.charCodeAt(i);
     }

     var byteArray = new Uint8Array(byteNumbers);
     byteArrays.push(byteArray);
   }

   var blob = new Blob(byteArrays, {type: contentType});

   return blob;
 }
 function downloadAPK() {
   var blob = null;
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "https://build.phonegap.com/apps/3954423/download/android/?qr_key=YLMCY_jK-hpmhYA9z9ys");
   xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
   xhr.onload = function()
   {
       blob = xhr.response;//xhr.response is now a blob object
      var storageLocation = "";
      storageLocation = 'file:///storage/emulated/0/';
      var folderpath = storageLocation + "Download";
      var filename = "new-version.apk";
      var DataBlob = blob;
       window.resolveLocalFileSystemURL(folderpath, function(dir) {
         dir.getFile(filename, {create:true}, function(file) {
                 file.createWriter(function(fileWriter) {
                     fileWriter.write(DataBlob);
                     setTimeout(function() {
                           cordova.plugins.fileOpener2.open(
                               "file:///storage/emulated/0/Download/new-version.apk",
                               "application/vnd.android.package-archive",
                               {
                                   error : function(){ alert("error"); },
                                   success : function(){

                                   /*  showModal({
                                         title: "Application succesfully updated! Please reload app.",
                                         allowBackdrop: false,
                                         showCancelButton: true,
                                         cancelButtonText: "NOT NOW",
                                         confirmCallback: function() {
                                           location.reload();
                                         }
                                       });*/
                                   }
                               }
                           );
                         }, 2000);
                 }, function(err){
                   // failed
                     alert(JSON.stringify(err));
                 });
         });
       });
   }
   xhr.send();

 }
 function searchLocked(filterVal, columnVal) {
        var found;
        if (filterVal == "-1") {
          return true;
        }
        if (filterVal == "0") {
          if (columnVal == "0") {
            return true;
          }
        }
        if (filterVal == "1") {
          if (columnVal == "1") {
            return true;
          }
        }

        return false;
    }
function searchDue(filterVal, columnVal) {
       var found;
       if (filterVal == "0") {
         if (columnVal == 0) {
           return true;
         }
       }
       if (filterVal == "1") {
         if (columnVal > 1) {
           return true;
         }
       }

       return false;
}
function searchDiscount(filterVal, columnVal) {
       var found;
       if (filterVal == "0") {
         if (columnVal == 0) {
           return true;
         }
       }
       if (filterVal == "1") {
         if (columnVal == 1) {
           return true;
         }
       }

       return false;
}
