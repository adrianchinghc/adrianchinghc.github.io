window.setTimeout(function() {
    $(".alert-success:visible, .alert-danger:visible").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove(); 
    });
}, 6000);