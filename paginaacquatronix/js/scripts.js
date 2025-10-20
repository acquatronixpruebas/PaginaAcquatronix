/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // ================================
    // BOTONES FLOTANTES DE WHATSAPP
    // ================================
    setupWhatsAppButtons();

});

// Función para configurar los botones flotantes de WhatsApp
function setupWhatsAppButtons() {
    const whatsappVentas = document.getElementById('floatingWhatsappVentas');
    const whatsappSoporte = document.getElementById('floatingWhatsappSoporte');

    // Configurar botón de VENTAS
    if (whatsappVentas) {
        whatsappVentas.addEventListener('click', () => {
            const phoneNumber = '+525515039019'; 
            const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre los sistemas Acquatronix.');
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });

        // Animación especial al hacer hover
        whatsappVentas.addEventListener('mouseenter', () => {
            whatsappVentas.style.animation = 'none';
            whatsappVentas.style.transform = 'scale(1.1) rotate(15deg)';
        });

        whatsappVentas.addEventListener('mouseleave', () => {
            whatsappVentas.style.transform = '';
            whatsappVentas.style.animation = 'bounce 2s infinite';
        });
    }

    // Configurar botón de SOPORTE
    if (whatsappSoporte) {
        whatsappSoporte.addEventListener('click', () => {
            const phoneNumber = '+525579255751'; 
            const message = encodeURIComponent('Tengo una consulta de mi sistema Acquatronix.');
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });

        // Animación especial al hacer hover
        whatsappSoporte.addEventListener('mouseenter', () => {
            whatsappSoporte.style.animation = 'none';
            whatsappSoporte.style.transform = 'scale(1.1) rotate(-15deg)';
        });

        whatsappSoporte.addEventListener('mouseleave', () => {
            whatsappSoporte.style.transform = '';
            whatsappSoporte.style.animation = 'bounce 2s infinite';
        });
    }

    // Mostrar/ocultar botones según scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > 10) {
            if (whatsappVentas) {
                whatsappVentas.style.opacity = '1';
                whatsappVentas.style.pointerEvents = 'auto';
            }
            if (whatsappSoporte) {
                whatsappSoporte.style.opacity = '1';
                whatsappSoporte.style.pointerEvents = 'auto';
            }
        } else {
            if (whatsappVentas) whatsappVentas.style.opacity = '0.7';
            if (whatsappSoporte) whatsappSoporte.style.opacity = '0.7';
        }
    });
}

console.log('✅ Botones flotantes de WhatsApp cargados correctamente');

// ================================
// FORMULARIO DE CONTACTO PHP
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('submitSuccessMessage');
    const errorMessage = document.getElementById('submitErrorMessage');
    
    // Variable para almacenar el último mensaje enviado
    let lastSubmittedMessage = '';
    let isMessageBlocked = false;

    if (contactForm) {
        // ================================
        // VALIDACIÓN EN TIEMPO REAL
        // ================================
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validar al perder el foco
            input.addEventListener('blur', function() {
                if (!this.checkValidity() && this.value !== '') {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else if (this.value !== '') {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                }
            });
            
            // Limpiar validación al escribir
            input.addEventListener('input', function() {
                if (this.value === '') {
                    this.classList.remove('is-invalid', 'is-valid');
                }
                
                // Si es el campo de mensaje, verificar si cambió
                if (this.id === 'message') {
                    checkMessageChange(this.value);
                }
            });
        });
        
        // ================================
        // FUNCIÓN PARA VERIFICAR CAMBIOS EN EL MENSAJE
        // ================================
        function checkMessageChange(currentMessage) {
            if (isMessageBlocked && currentMessage !== lastSubmittedMessage) {
                // El mensaje cambió, desbloquear el botón
                isMessageBlocked = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensaje';
                submitButton.classList.remove('btn-secondary');
                submitButton.classList.add('btn-primary');
            }
        }
        
        // ================================
        // MANEJO DEL ENVÍO DEL FORMULARIO
        // ================================
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar formulario
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }
            
            // Obtener el mensaje actual
            const currentMessage = document.getElementById('message').value;
            
            // Verificar si es el mismo mensaje
            if (currentMessage === lastSubmittedMessage && isMessageBlocked) {
                errorMessage.innerHTML = '<div class="text-center text-warning mb-3">Ya enviaste este mensaje. Por favor, modifica el contenido para enviar uno nuevo.</div>';
                errorMessage.classList.remove('d-none');
                setTimeout(() => {
                    errorMessage.classList.add('d-none');
                }, 4000);
                return;
            }
            
            // Deshabilitar botón durante el envío
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Obtener datos del formulario
            const formData = new FormData(contactForm);

            try {
                // Enviar formulario al script PHP
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Guardar el mensaje enviado
                    lastSubmittedMessage = currentMessage;
                    isMessageBlocked = true;
                    
                    // Mostrar mensaje de éxito
                    successMessage.classList.remove('d-none');
                    errorMessage.classList.add('d-none');
                    
                    // Cambiar apariencia del botón bloqueado
                    submitButton.classList.remove('btn-primary');
                    submitButton.classList.add('btn-secondary');
                    submitButton.textContent = 'Mensaje ya enviado';
                    submitButton.disabled = true;
                    
                    // Limpiar campos excepto el mensaje
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('phone').value = '';
                    
                    // Remover clases de validación
                    inputs.forEach(input => {
                        if (input.id !== 'message') {
                            input.classList.remove('is-valid', 'is-invalid');
                        }
                    });
                    
                    // Ocultar mensaje de éxito después de 5 segundos
                    setTimeout(() => {
                        successMessage.classList.add('d-none');
                    }, 5000);
                    
                } else {
                    throw new Error(result.message || 'Error en el envío');
                }
            } catch (error) {
                // Mostrar mensaje de error
                errorMessage.innerHTML = `<div class="text-center text-danger mb-3">¡Error al enviar el mensaje! ${error.message}</div>`;
                errorMessage.classList.remove('d-none');
                successMessage.classList.add('d-none');
                submitButton.textContent = 'Enviar Mensaje';
                submitButton.disabled = false;
                submitButton.classList.remove('btn-secondary');
                submitButton.classList.add('btn-primary');

                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    errorMessage.classList.add('d-none');
                }, 5000);
            }
        });
    }
});