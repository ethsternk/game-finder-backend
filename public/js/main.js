$(document).ready(function(){
    $('.delete-event').on('click', function(e){
        $target = $(e.target);
        const id = ($target.attr('data-id'));
        $.ajax({
            type: 'DELETE',
            url: '/event/'+id,
            success: function(response){
                alert('Deleting Event');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});