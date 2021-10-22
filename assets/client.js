$(document).ready(function(){
    var socket = io.connect("http://localhost:3000");
    var ready = false;

    $("#submit").submit(function(e) {
        e.preventDefault();
        $("#nick").fadeOut();
        $("#chat").fadeIn();
        var name = $("#nickname").val();
        var time = new Date();
        $("#name").html(name);
        $("#time").html('Primeiro acesso: ' + time.getHours() + ':' + time.getMinutes());
    
        ready = true;
        socket.emit("join", name);
    });


    socket.on("update", function(msg) {
        if (ready) {
            $('.chat').append('<li class="info">' + msg + '</li>')
        }
    });

    socket.on("lista", function(clients){
        if (ready) {
            $('.navbar__menu').html("");
            for(const [key,value] of Object.entries(clients)){
                $('.navbar__menu').append('<li class="navbar__item">'+ value +'</li>')
            }
        }
    });
    
    $("#textarea").keypress(function(e){
        if(e.which == 13) {
             var text = $("#textarea").val();
             $("#textarea").val('');
             var time = new Date();
             $(".chat").append('<li class="self"><div class="msg"><span>'
                          + $("#nickname").val() + ':</span>    <p>' + text + '</p><time>' + 
                          time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
             socket.emit("send", text);
             scrollToBottom();
        }
    });
    
    socket.on("chat", function(client,msg) {
        if (ready) {
           var time = new Date();
           $(".chat").append('<li class="other"><div class="msg"><span>' + 
                        client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + 
                        time.getMinutes() + '</time></div></li>');
                        scrollToBottom();
        }
       });
    
    const menu = document.querySelector('#mobile-menu')
    const menuLink = document.querySelector('.navbar__menu')

    // display mobile menu
    const mobileMenu = () => {
    menu.classList.toggle('is-active')
    menuLink.classList.toggle('active')
    }

    menu.addEventListener('click', mobileMenu);
});
