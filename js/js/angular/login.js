app.controller('Login', function ($scope, Notification) {
    $scope.servidor = 'http://35.231.233.240:3000/api';

    $scope.iniciarSesion = function () {
        if($scope.password !== undefined && $scope.password.length > 0 && $scope.email !== undefined && $scope.email.length > 0) {
            $scope.iniciando = true;

            $.ajax({
                url: $scope.servidor + '/Usuarios/login',
                type: 'post',
                data: {
                    usuario: $scope.email,
                    password: $scope.password
                } ,
                success: function(data){
                    if (data.usuario !== null ) {
                        $scope.iniciando = false;
                        $scope.usuario = data;

                        localStorage.setItem('usuario', JSON.stringify($scope.usuario));

                        //Reinicia los campos de control
                        $scope.correo = "";
                        $scope.password ="";
                        $scope.pagina = "ventas";
                        $scope.$apply();
                
                        document.location.href = $(location).attr('href').replace('login.html', 'index.html');
                    } else {
                        Notification.warning({
                            message: 'Usuario y/o contraseña incorrectos.',
                            delay: 4500,
                            replaceMessage: false
                        });
                    }
                },
                error: function(err){
                    Notification.error({
                        message: 'No es posible iniciar sesión en este momento, intente de nuevo más tarde.',
                        delay: 4500,
                        replaceMessage: false
                    });
                }
            });
        } else {
            Notification.warning({
                message: 'Ingrese el correo y contraseña.',
                delay: 4500,
                replaceMessage: false
            });
        }
    };

    angular.element(document).ready(function () {
        window.scrollTo(0, 0);
        $scope.usuario = localStorage.getItem('usuario') === null ? undefined : JSON.parse(localStorage.getItem('usuario'));

        if ($scope.usuario !== undefined) {
            document.location.href = window.location.pathname.replace('login.html', 'index.html');
        } else {
            localStorage.removeItem('usuario');
        }

        $("#password").keyup(function(e){
            if(e.keyCode === 13)
            {
                $scope.iniciarSesion();
            }
        });

        $scope.$apply();
    });
});