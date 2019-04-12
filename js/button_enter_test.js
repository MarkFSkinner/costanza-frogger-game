var buttonPress = function() {
    //var me = this;
    //$(button).removeClass('hidden')
    $(function() {
        //$('.select').keyup(function(event){
        $(document).keyup(function(event) {
            if(event.keyCode == 13){
                //event.preventDefault();
                $('.select').click();
                //$('#win').addClass('hidden')
                //return false;
                event.preventDefault();
            }
        });

        $('.select').click(function() {
            $('#win').addClass('hidden')
        });
    });
}

$(document).ready(buttonPress);

/*$(document).keyup(function(event) {
    if(event.keyCode == 13) {
        alert('You pressed enter!');
    }
});*/