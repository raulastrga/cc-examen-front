app.controller('Index', function ($scope, Notification) {
    moment.locale('es');
    $scope.cargando = false;
    $scope.proceso = 'paso1';

    /* Métodos para módulo de Artículos */

    $scope.initConfiguracion = function (render) {
        //Obtiene el listado de ventas registradas
        $.get('http://35.231.233.240:3000/api/Configuraciones', function (data) {
            if (data.length > 0) {
                //Se obtiene la configuración desde la BD
                $scope.configuracion = data[0];
            } else {
                //Sino existe la configuración en la BD se crea como vacia
                $scope.configuracion = {
                    porcentajeEnganche: 0,
                    tasaFinanciamiento: 0,
                    plazoMaximo: 0,
                };
            }

            $scope.$apply();
        });

        //Se valida que sólo se ingresen numeros validos en tasa financiamiento
        $("#tasaFinanciamiento").on('keypress', function(e){
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
                e.stopImmediatePropagation();
                var key = window.event ? event.keyCode : event.which;
                if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39) {
                    return true;
                } else if ( key < 48 || key > 57 ) {
                    return false;
                } else {
                    return true;
                }
            }
        });

        //Se valida que sólo se ingresen numeros validos en porcentaje enganche
        $("#porcentajeEnganche").on('keypress', function(e){
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
                e.stopImmediatePropagation();
                var key = window.event ? event.keyCode : event.which;
                if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39) {
                    return true;
                } else if ( key < 48 || key > 57 ) {
                    return false;
                } else {
                    return true;
                }
            }
        });
    };

    $scope.guardarConfiguracion = function() {
        if(!$scope.validarConfiguracion()) return;
        $scope.cargando = true;

        //Se crea el objeto de la Configuración a guardar
        var configuracion = {
            tasaFinanciamiento: $scope.configuracion.tasaFinanciamiento,
            porcentajeEnganche: $scope.configuracion.porcentajeEnganche,
            plazoMaximo: $scope.configuracion.plazoMaximo
        }

        //Se envía la información para registrar el articulo
        $.post('http://35.231.233.240:3000/api/Configuraciones/registrar',  configuracion, function (data) {
            Notification.success({
                message: 'Bien Hecho, La Configuración ha sido registrada correctamente.',
                delay: 4500,
                replaceMessage: false
            });

            //Se reinician los valores por default
            $scope.cargando = false;
            $scope.$apply();
        });
    }

    $scope.validarConfiguracion = function() {
        var valido = true;

        //Se valida que el Tasa de Financiamiento haya sido ingresado
        if ($scope.configuracion.tasaFinanciamiento === undefined || $scope.configuracion.tasaFinanciamiento === null || $scope.configuracion.tasaFinanciamiento.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar la Tasa de Financiamiento, es obligatoria.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        } else {
            //Se valida que la Tasa de Financiamiento ingresada sea valida
            if(isNaN($scope.configuracion.tasaFinanciamiento)) {
                Notification.warning({
                    message: 'No es posible continuar, debe ingresar una Tasa de Financiamiento valida.',
                    delay: 4500,
                    replaceMessage: false
                });
    
                valido = false;
            }
        }

        //Se valida que el Porcentaje de Enganche haya sido ingresado
        if ($scope.configuracion.porcentajeEnganche === undefined || $scope.configuracion.porcentajeEnganche === null || $scope.configuracion.porcentajeEnganche.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Porcentaje de Enganche, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        } else {
            //Se valida que la Porcentaje de Enganche ingresada sea valida
            if(isNaN($scope.configuracion.porcentajeEnganche)) {
                Notification.warning({
                    message: 'No es posible continuar, debe ingresar un Porcentaje de Enganche valido.',
                    delay: 4500,
                    replaceMessage: false
                });
    
                valido = false;
            }
        }

        //Se valida que el Plazo Máximo haya sido ingresado
        if ($scope.configuracion.plazoMaximo === undefined || $scope.configuracion.plazoMaximo === null || $scope.configuracion.plazoMaximo === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Plazo Máximo, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        return valido;
    }

    /* Fin módulo Configuración */

    /* Métodos para módulo de Artículos */

    $scope.initArticulos = function (render) {
        //Obtiene el listado de ventas registradas
        $.get('http://35.231.233.240:3000/api/Articulos', function (data) {
            $scope.articulos = data;
            $scope.$apply();
            render ? renderTable('articulos') : null;
        });
    };

    $scope.modalNuevoArticulo = function() {
        $('#modalNuevoArticulo').modal();
        $('#modalNuevoArticulo').modal('open');

        //Obtiene el folio del nuevo artículo
        $.get('http://35.231.233.240:3000/api/Configuraciones', function (data) {
            data = data[0];
            $scope.claveArticulo = data.ultimoArticulo + 1;
            $scope.articuloNuevo = {};

            $scope.$apply();

            //Se valida que sólo se ingresen numeros validos en precio
            $("#precio").on('keypress', function(e){
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
                    e.stopImmediatePropagation();
                    var key = window.event ? event.keyCode : event.which;
                    if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39) {
                        return true;
                    } else if ( key < 48 || key > 57 ) {
                        return false;
                    } else {
                        return true;
                    }
                }
            });
        });
    }

    $scope.cerrarModalArticulo = function () {
        swal({
            title: "¿Desea cancelar el registro?",
            text: "Se cancelará el registro del artículo",
            type: "warning",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cerrar",
            showCancelButton: true,
            closeOnConfirm: true
        }, function(){
                $scope.articuloNuevo = {};
                $('#modalNuevoArticulo').modal('close');
        });
    }

    $scope.guardarArticulo = function() {
        if(!$scope.validarArticulo($scope.articuloNuevo)) return;
        $scope.cargando = true;

        //Se crea el objeto del Articulo a guardar
        var articulo = {
            clave: $scope.claveArticulo,
            descripcion: $scope.articuloNuevo.descripcion,
            modelo: $scope.articuloNuevo.modelo,
            precio: $scope.articuloNuevo.precio,
            existencia: $scope.articuloNuevo.existencia
        }

        //Se envía la información para registrar el articulo
        $.post('http://35.231.233.240:3000/api/Articulos/registrar',  articulo, function (data) {
            Notification.success({
                message: 'Bien Hecho, El Articulo ha sido registrado correctamente.',
                delay: 4500,
                replaceMessage: false
            });

            //Se cierra el modal de nuevo articulo y se reinician los valores
            $scope.articuloNuevo = {};
            $('#modalNuevoArticulo').modal('close');
            $scope.cargando = false;
            $scope.$apply();

            //Se carga nuevamente la lista de articulos registrados
            $scope.initArticulos();
        });
    }

    $scope.modalEditarArticulo = function(articulo) {
        $('#modalEditarArticulo').modal();
        $('#modalEditarArticulo').modal('open');

        $scope.articuloEditar = articulo;
    }

    $scope.cerrarModalArticuloEditar = function () {
        swal({
            title: "¿Desea cancelar la modificación?",
            text: "Se cancelará la modificación del artículo",
            type: "warning",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cerrar",
            showCancelButton: true,
            closeOnConfirm: true
        }, function(){
            $scope.articuloEditar = {};
            $('#modalEditarArticulo').modal('close');
        });        
    }

    $scope.guardarArticuloEditar = function() {
        if(!$scope.validarArticulo($scope.articuloEditar)) return;
        $scope.cargando = true;

        //Se crea el objeto del Articulo a guardar
        var articulo = {
            id: $scope.articuloEditar.id,
            clave: $scope.articuloEditar.clave,
            descripcion: $scope.articuloEditar.descripcion,
            modelo: $scope.articuloEditar.modelo,
            precio: $scope.articuloEditar.precio,
            existencia: $scope.articuloEditar.existencia
        }

        //Se envía la información para actualizar el articulo
        $.post('http://35.231.233.240:3000/api/Articulos/editar',  articulo, function (data) {
            Notification.success({
                message: 'Bien Hecho, El Articulo ha sido actualizado correctamente.',
                delay: 4500,
                replaceMessage: false
            });

            //Se cierra el modal de editar articulo y se reinician los valores
            $scope.articuloEditar = {};
            $('#modalEditarArticulo').modal('close');
            $scope.cargando = false;
            $scope.$apply();

            //Se carga nuevamente la lista de articulos registrados
            $scope.initArticulos();
        });
    }

    $scope.validarArticulo = function(articulo) {
        var valido = true;

        //Se valida que la descripción haya sido ingresada
        if (articulo.descripcion === undefined || articulo.descripcion.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar la Descripción, es obligatoria.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        //Se valida que el modelo haya sido ingresado
        if (articulo.modelo === undefined || articulo.modelo.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Modelo, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        //Se valida que el Precio haya sido ingresado
        if (articulo.precio === undefined || articulo.precio.length === 0 ) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Precio, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        } else {
            //Se valida que el precio ingresado sea valido
            if(isNaN(articulo.precio)) {
                Notification.warning({
                    message: 'No es posible continuar, debe ingresar un Precio valido.',
                    delay: 4500,
                    replaceMessage: false
                });
    
                valido = false;
            }
        }

        //Se valida que el Existencia haya sido ingresado
        if (articulo.existencia === undefined || articulo.existencia === null || articulo.existencia.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar la Existencia, es obligatoria.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        } else {
            //Se valida que la existencia ingresada sea valida
            if(isNaN(articulo.existencia)) {
                Notification.warning({
                    message: 'No es posible continuar, debe ingresar una Existencia valida.',
                    delay: 4500,
                    replaceMessage: false
                });
    
                valido = false;
            }
        }

        return valido;
    }

    /* Fin módulo articulos */

    /* Métodos para módulo de Clientes */
    $scope.initClientes = function (render) {
        //Obtiene el listado de ventas registradas
        $.get('http://35.231.233.240:3000/api/Clientes', function (data) {
            $scope.clientes = data;
            $scope.$apply();
            render ? renderTable('clientes') : null;
        });
    };

    $scope.modalNuevoCliente = function() {
        $('#modalNuevoCliente').modal();
        $('#modalNuevoCliente').modal('open');

        //Obtiene el folio del nuevo cliente
        $.get('http://35.231.233.240:3000/api/Configuraciones', function (data) {
            data = data[0];
            $scope.claveCliente = data.ultimoCliente + 1;
            $scope.clienteNuevo = {};

            $scope.$apply();
        });
    }

    $scope.cerrarModalCliente = function () {
        swal({
            title: "¿Desea cancelar el registro?",
            text: "Se cancelará el registro del cliente",
            type: "warning",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cerrar",
            showCancelButton: true,
            closeOnConfirm: true
        }, function(){
            $scope.clienteNuevo = {};
            $('#modalNuevoCliente').modal('close');
        });
    }

    $scope.guardarCliente = function() {
        if(!$scope.validarCliente($scope.clienteNuevo)) return;
        $scope.cargando = true;

        //Se crea el objeto del Cliente a guardar
        var cliente = {
            clave: $scope.claveCliente,
            nombre: $scope.clienteNuevo.nombre,
            apellidoPaterno: $scope.clienteNuevo.apellidoPaterno,
            apellidoMaterno: $scope.clienteNuevo.apellidoMaterno,
            rfc: $scope.clienteNuevo.rfc
        }

        //Se envía la información para registrar el cliente
        $.post('http://35.231.233.240:3000/api/Clientes/registrar',  cliente, function (data) {
            Notification.success({
                message: 'Bien Hecho, El Cliente ha sido registrado correctamente.',
                delay: 4500,
                replaceMessage: false
            });

            //Se cierra el modal de nuevo cliente y se reinician los valores
            $scope.clienteNuevo = {};
            $('#modalNuevoCliente').modal('close');
            $scope.cargando = false;
            $scope.$apply();

            //Se carga nuevamente la lista de clientes registrados
            $scope.initClientes();
        });
    }

    $scope.modalEditarCliente = function(cliente) {
        $('#modalEditarCliente').modal();
        $('#modalEditarCliente').modal('open');

        $scope.clienteEditar = cliente;
    }

    $scope.cerrarModalClienteEditar = function () {
        swal({
            title: "¿Desea cancelar la modificación?",
            text: "Se cancelará la modificación del cliente",
            type: "warning",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cerrar",
            showCancelButton: true,
            closeOnConfirm: true
        }, function(){
            $scope.clienteEditar = {};
            $('#modalEditarCliente').modal('close');
        });
    }

    $scope.guardarClienteEditar = function() {
        if(!$scope.validarCliente($scope.clienteEditar)) return;
        $scope.cargando = true;

        //Se crea el objeto del Cliente a guardar
        var cliente = {
            id: $scope.clienteEditar.id,
            clave: $scope.clienteEditar.clave,
            nombre: $scope.clienteEditar.nombre,
            apellidoPaterno: $scope.clienteEditar.apellidoPaterno,
            apellidoMaterno: $scope.clienteEditar.apellidoMaterno,
            rfc: $scope.clienteEditar.rfc
        }

        //Se envía la información para actualizar el cliente
        $.post('http://35.231.233.240:3000/api/Clientes/editar',  cliente, function (data) {
            Notification.success({
                message: 'Bien Hecho, El Cliente ha sido actualizado correctamente.',
                delay: 4500,
                replaceMessage: false
            });

            //Se cierra el modal de editar cliente y se reinician los valores
            $scope.clienteEditar = {};
            $('#modalEditarCliente').modal('close');
            $scope.cargando = false;
            $scope.$apply();

            //Se carga nuevamente la lista de clientes registrados
            $scope.initClientes();
        });
    }

    $scope.validarCliente = function(cliente) {
        var valido = true;

        //Se valida que el RFC haya sido ingresado
        if (cliente.rfc === undefined || cliente.rfc.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el RFC, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        } else {
            //Se valida que el RFC sea valido
            var re = /^[a-zA-Z]{3,4}(\d{6})((\D|\d){2,3})?$/;
            var validarRfc = re.test(cliente.rfc);
            if(!validarRfc) {
                Notification.warning({
                    message: 'No es posible continuar, debe ingresar el RFC valido.',
                    delay: 4500,
                    replaceMessage: false
                });

                valido = false;
            }
        }

        //Se valida que el Nombre haya sido ingresado
        if (cliente.nombre === undefined || cliente.nombre.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Nombre, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        //Se valida que el Apellido Paterno haya sido ingresado
        if (cliente.apellidoPaterno === undefined || cliente.apellidoPaterno.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Apellido Paterno, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        //Se valida que el Apellido Materno haya sido ingresado
        if (cliente.apellidoMaterno === undefined || cliente.apellidoMaterno.length === 0) {
            Notification.warning({
                message: 'No es posible continuar, debe ingresar el Apellido Materno, es obligatorio.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        return valido;
    }
    /* Fin módulo clientes */


    /* Métodos para módulo de Ventas */
    $scope.initVentas = function (render) {
        //Obtiene el listado de ventas registradas
        $.get('http://35.231.233.240:3000/api/Ventas', function (data) {
            $scope.ventas = data;
            $scope.$apply();
            render ? renderTable('ventas') : null;
        });
    };

   $scope.buscarCliente = function() {
        var texto = $("#autocomplete-input-cliente").val();
       //Si ha presionado al menos 2 caracteres prepara los resultados
       if (texto.length <= 1) return;

        //Busca los clientes coincidentes con el texto ingresado
        $.post('http://35.231.233.240:3000/api/Clientes/searchByName', { texto }, function (data) {
            $scope.resultadoClientes = data.clientes;
            var lista = {};

            for (var i = 0; i < data.clientes.length; ++i) {
                lista[data.clientes[i].id] = {
                    imagen: null,
                    nombre: data.clientes[i].nombre + ' ' + data.clientes[i].apellidoPaterno + ' ' + data.clientes[i].apellidoMaterno
                };
            };
    
            //Se asigna la lista de resultados coincidentes al autocomplete
            $('#autocomplete-input-cliente').autocomplete({
                data: lista,
                limit: 20,
                onAutocomplete: function(id) {
                    //Cuando se eliga un elemento del autocomplete lo asigna como cliente seleccionado
                    $scope.clienteSeleccionado = $scope.resultadoClientes.filter(function(item){
                        return item.id === id;
                    })[0];

                    $scope.$apply();
                },
                minLength: 3
            });

            //Muestra los resultados del autocomplete
            $("#autocomplete-input-cliente").keydown();

            $scope.$apply();
        });
    };

    $scope.buscarArticulo = function() {
        var texto = $("#autocomplete-input-articulo").val();
       //Si ha presionado al menos 2 caracteres prepara los resultados
       if (texto.length <= 1) return;

        //Busca los articulos coincidentes con el texto ingresado
        $.post('http://35.231.233.240:3000/api/Articulos/searchByName', { texto }, function (data) {
            $scope.resultadoArticulos = data.articulos;
            var lista = {};

            for (var i = 0; i < data.articulos.length; ++i) {
                lista[data.articulos[i].id] = {
                    imagen: null,
                    nombre: data.articulos[i].descripcion
                };
            };
    
            //Se asigna la lista de resultados coincidentes al autocomplete
            $('#autocomplete-input-articulo').autocomplete({
                data: lista,
                limit: 20,
                onAutocomplete: function(id) {
                    //Cuando se eliga un elemento del autocomplete lo asigna como articulo seleccionado
                    $scope.articuloSeleccionado = $scope.resultadoArticulos.filter(function(item){
                        return item.id === id;
                    })[0];

                    $scope.$apply();
                },
                minLength: 3
            });

            //Muestra los resultados del autocomplete
            $("#autocomplete-input-articulo").keydown();

            $scope.$apply();
        });
    };

    $scope.modalNuevaVenta = function() {
        $('#modalNuevaVenta').modal();
        $('#modalNuevaVenta').modal('open');

        //Obtiene el folio de la nueva venta
        $.get('http://35.231.233.240:3000/api/Configuraciones', function (data) {
            data = data[0];
            if (data != null) {
                $scope.folioVenta = data.ultimoFolio + 1;
                $scope.tasaFinanciamiento = data.tasaFinanciamiento;
                $scope.plazoMaximo = data.plazoMaximo;
                $scope.porcentajeEnganche = data.porcentajeEnganche;
                $scope.resultadoClientes = {};
                $scope.detalleVenta = [];
            } else {
                Notification.error({
                    message: 'Ocurrió un error al obtener la información completa, intente más tarde.',
                    delay: 4500,
                    replaceMessage: false
                });

                $('#modalNuevaVenta').modal('close');
            }

            $scope.$apply();
        });
    }

    $scope.agregarArticulo = function() {
        //Verifica si el articulo ya fue agregado a la lista
        var articulo = $scope.detalleVenta.filter(function(item){
            item.focus = false;
            return item.id === $scope.articuloSeleccionado.id;
        })[0];
        if(articulo !== undefined) { //Ya existe en la lista
            //Enciende el foco en el campo cantidad del articulo agregado
            articulo.focus = true;
            
            //Verifica si aun se puede agregar otro articulo
            if(articulo.cantidad + 1 <= articulo.existencia) {
                //Se asigna el precio del articulo de acuerdo a la tasa de financiamiento y el plazo maximo
                articulo.precio = articulo.precio * (1 + ($scope.tasaFinanciamiento * $scope.plazoMaximo) / 100)

                //Se actualiza la información del articulo
                articulo.cantidad = articulo.cantidad + 1;
                articulo.importe = articulo.precio * articulo.cantidad;
    
                //Se vacia el articulo seleccionado y su correspondiente autocomplete
                $scope.articuloSeleccionado = undefined;
                $("#autocomplete-input-articulo").val('');
            } else { //Muestra error porque ya no tiene más existencia disponible
                Notification.error({
                    message: 'El artículo seleccionado no cuenta con existencia suficiente, favor de verificar',
                    delay: 4500,
                    replaceMessage: false
                });
            }
        } else {
            //Enciende el foco en el campo cantidad del articulo agregado
            $scope.articuloSeleccionado.focus = true;

            if ($scope.articuloSeleccionado.existencia >= 1) {
                //Se asigna el precio del articulo de acuerdo a la tasa de financiamiento y el plazo maximo
                $scope.articuloSeleccionado.precio = $scope.articuloSeleccionado.precio * (1 + ($scope.tasaFinanciamiento * $scope.plazoMaximo) / 100)

                //Se asigna la información por default al articulo
                $scope.articuloSeleccionado.cantidad = 1;
                $scope.articuloSeleccionado.importe = $scope.articuloSeleccionado.precio;
    
                 //Se agrega el articulo seleccionado a la lista del detalle de la venta
                $scope.detalleVenta.push($scope.articuloSeleccionado);
    
                //Se vacia el articulo seleccionado y su correspondiente autocomplete
                $scope.articuloSeleccionado = undefined;
                $("#autocomplete-input-articulo").val('');
            } else {
                Notification.error({
                    message: 'El artículo seleccionado no cuenta con existencia, favor de verificar',
                    delay: 4500,
                    replaceMessage: false
                });
            }
        }

        //Se actualizan los totales
        $scope.actualizarTotales();
    }

    $scope.actualizarTotales = function() {
        //Se obtiene la suma de los importes de todos los articulos
        var importeTotal = 0;
        $scope.detalleVenta.forEach(function (item) {
            importeTotal = importeTotal + item.importe;
        });

        //Se calcula el enganche
        $scope.enganche = ($scope.porcentajeEnganche / 100) * importeTotal;

        //Se calcula la bonificación del enganche
        $scope.bonificacionEnganche = $scope.enganche * (($scope.tasaFinanciamiento * $scope.plazoMaximo) / 100);

        //Se calcula el total del adeudo
        $scope.totalAdeudo = importeTotal - $scope.enganche  - $scope.bonificacionEnganche;
    }

    $scope.cambiarCantidad = function (idArticulo) {
        //Obtiene el articulo por id
        var articulo = $scope.detalleVenta.filter(function(item){
            return item.id === idArticulo;
        })[0];

        //Valida que el campo no haya quedado en 0
        if (articulo.cantidad === null || articulo.cantidad  === undefined) {
            articulo.cantidad = 1;
        }

        //Verifica si alcanza la existencia
        if (articulo.cantidad > articulo.existencia) {
            //Muestra error si no alcanza
            Notification.error({
                message: 'El artículo seleccionado no cuenta con existencia suficiente, favor de verificar',
                delay: 4500,
                replaceMessage: false
            });

            //Asigna la cantidad con el máximo posible la existencia
            articulo.cantidad = articulo.existencia;
        } else {
            //Si la existencia aun alcanza entonces, calcula el importe con la nueva cantidad
            articulo.importe = articulo.precio * articulo.cantidad
        }

        //Se actualizan los totales
        $scope.actualizarTotales();
    }

    $scope.eliminarArticulo = function (articulo) {
        //Se obtiene el indice del articulo de la lista del detalle
        var index = $scope.detalleVenta.indexOf(articulo);

        //Si se encuentra el elemento lo elimina de la lista
        if (index > -1) {
            $scope.detalleVenta.splice(index, 1);
        }

        //Se actualizan los totales
        $scope.actualizarTotales();
    }

    $scope.crearPlazos = function() {
        if(!$scope.validarDetalleVenta()) return;
        //Arreglo con los distintos plazos
        var plazos = [3, 6, 9, 12];

        //Se calcula el precio de contado en general
        $scope.precioContado = $scope.totalAdeudo / (1 + (($scope.tasaFinanciamiento * $scope.plazoMaximo) / 100));
        
        //Inicializa la lista de plazos a mostrar
        $scope.plazos = [];

        //Inicia con los calculos
        plazos.forEach(function(plazo) {
            var totalPagar = $scope.precioContado * (1 + ($scope.tasaFinanciamiento * plazo) / 100);
            var importeAbono = totalPagar / plazo;
            var importeAhorra = $scope.totalAdeudo - totalPagar;

            //Se crea un objeto con las propiedades anteriormente creadas
            var plazoObjeto = {
                plazo,
                totalPagar,
                importeAbono,
                importeAhorra
            };

            //Se agrega el plazo a la lista a mostrar
            $scope.plazos.push(plazoObjeto);
        });

        //Cambia al paso2
        $scope.proceso = 'paso2';

        //Asigna por default el plazo seleccionado al primer plazo de la lista
        $scope.plazoSeleccionado = plazos[0];
    }

    $scope.validarDetalleVenta = function() {
        var valido = true;
        //Valida que se haya seleccionado un cliente
        if ($scope.clienteSeleccionado === undefined) {
            valido = false;
        }

        //Valida que se haya seleccionado al menos en articulo
        if ($scope.detalleVenta === undefined || $scope.detalleVenta.length === 0) {
            valido = false;
        }

        //Valida que ningun articulo tenga menos de 1 como cantidad
        $scope.detalleVenta.forEach(function(item) {
            if (item.cantidad <= 0) {
                valido = false;
            }
        });

        if(!valido) {
            Notification.warning({
                message: 'Los datos ingresados no son correctos, favor de verificar',
                delay: 4500,
                replaceMessage: false
            });
        }

        return valido;
    }

    $scope.guardarVenta = function() {
        if (!$scope.validarPlazo()) return;
        $scope.cargando = true;

        //Obtiene la información del plazo seleccionado
        var plazoSeleccionado = $scope.plazos.filter(function(item){
            return item.plazo === $("input[type='radio']:checked").val() * 1;
        })[0];

        //Se crea el objeto venta a guardar
        var venta = {
            folio: $scope.folioVenta,
            claveCliente: $scope.clienteSeleccionado.clave,
            nombreCliente: $scope.clienteSeleccionado.nombre + ' ' + $scope.clienteSeleccionado.apellidoPaterno +  ' ' + $scope.clienteSeleccionado.apellidoMaterno,
            totalPagar: plazoSeleccionado.totalPagar,
            plazo: plazoSeleccionado.plazo,
            precioContado: $scope.precioContado,
            importeAbono: plazoSeleccionado.importeAbono,
            importeAhorra: plazoSeleccionado.importeAhorra,
            detalleVenta: $scope.detalleVenta
        };

        //Se envía la información para registrar la venta
        $.post('http://35.231.233.240:3000/api/Ventas/registrar',  venta, function (data) {
            if(data !== null) {
                Notification.success({
                    message: 'Bien Hecho, Tu venta ha sido registrada correctamente.',
                    delay: 4500,
                    replaceMessage: false
                });
            }

            //Se cierra el modal de nueva venta y se reinician los valores
            $scope.articuloSeleccionado = undefined;
            $scope.clienteSeleccionado = undefined;
            $scope.plazoSeleccionado = undefined;
            $('#modalNuevaVenta').modal('close');
            $scope.cargando = false;
            $scope.$apply();

            //Se carga nuevamente la lista de ventas registradas
            $scope.initVentas();
        });
    }

    $scope.validarPlazo = function() {
        var valido = true;

        //Valida que se haya seleccionado un plazo
        if ($scope.plazoSeleccionado === undefined) {
            Notification.warning({
                message: 'Debe seleccionar un plazo para realizar el pago de su compra.',
                delay: 4500,
                replaceMessage: false
            });

            valido = false;
        }

        return valido;
    }

    $scope.cerrarModalVenta = function () {
        swal({
            title: "¿Desea cancelar la venta?",
            text: "Se cancelará la venta",
            type: "warning",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cerrar",
            showCancelButton: true,
            closeOnConfirm: true
        }, function(){
            $scope.articuloSeleccionado = undefined;
            $scope.clienteSeleccionado = undefined;
            $scope.plazoSeleccionado = undefined;
            $('#modalNuevaVenta').modal('close');
        });
    }

    $scope.atrasModalVenta = function() {
        $scope.proceso = 'paso1';
    }

    /* Fin módulo ventas */

    /* Métodos generales */
    $scope.cerrarSesion = function () {
        localStorage.removeItem('usuario');
        $scope.usuario = undefined;
        $('.button-collapse').sideNav('hide');

        Notification.success({
            message: 'Ha cerrado sesión correctamente',
            delay: 2500,
            replaceMessage: false
        });

        $scope.pagina = "ventas";

        if(window.location.pathname.search('index.html') === -1) {
            document.location.href = $(location).attr('href') + '/login.html';
        } else {
            var url = $(location).attr('href');
            var login = url.replace('index.html', 'login.html');
            document.location.href = login;
        }
    };

    $scope.changePage = function (page) {
        $scope.pagina = page;
        $('.button-collapse').sideNav('hide');
    };

    function readHtml(file, variable) {
        $.ajax({
            url: file,
            async: false,
            success: function(data) {
                $scope[variable] = data;
                $scope.$apply();
            }
        });
    }

    function renderTable (id) {
        $('#data-table-' + id).DataTable({
            responsive: true,
            "displayLength": 20,
            "language": {
                "decimal": "",
                "emptyTable": "No hay registros disponibles",
                "info": "Mostrando del _START_ al _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando del 0 al 0 de 0 registros",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ registros",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "No se encontraron coincidencias",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            }
        });

        $('select').material_select();
    }

    angular.element(document).ready(function () {
        //Se obtiene la fecha actual
        $scope.fechaActual = moment().format("DD/MM/YYYY");

        window.scrollTo(0, 0);
        var usuario = localStorage.getItem('usuario');
        $scope.usuario = usuario === null ? undefined : JSON.parse(usuario);

        if ($scope.usuario === undefined) {
            if(window.location.pathname.search('index.html') === -1) {
                document.location.href = $(location).attr('href') + 'login.html';
            } else {
                var url = $(location).attr('href');
                var login = url.replace('index.html', 'login.html');
                document.location.href = login;
            }
        } else {
            readHtml('ventas.html', 'htmlVentas');
            readHtml('clientes.html', 'htmlClientes');
            readHtml('articulos.html', 'htmlArticulos');
            readHtml('configuracion.html', 'htmlConfiguracion');
            $scope.$apply();
        }
    });

    /* Fin métodos generales */
});