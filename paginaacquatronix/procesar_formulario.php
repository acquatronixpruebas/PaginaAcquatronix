<?php
// Configuración
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Configuración de email
$destinatario = "soporte@acquatronix.com"; // Cambia esto por tu email
$asunto = "Nuevo mensaje de contacto - Acquatronix";

// Validar que sea una petición POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Función para limpiar datos
function limpiar_dato($dato) {
    $dato = trim($dato);
    $dato = stripslashes($dato);
    $dato = htmlspecialchars($dato);
    return $dato;
}

// Función para validar email
function validar_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Función para validar teléfono (10 dígitos)
function validar_telefono($telefono) {
    return preg_match('/^[0-9]{10}$/', $telefono);
}

// Función para validar nombre (solo letras y espacios)
function validar_nombre($nombre) {
    return preg_match('/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/', $nombre);
}

// Recoger y limpiar datos del formulario
$nombre = isset($_POST['nombre']) ? limpiar_dato($_POST['nombre']) : '';
$email = isset($_POST['email']) ? limpiar_dato($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? limpiar_dato($_POST['telefono']) : '';
$mensaje = isset($_POST['message']) ? limpiar_dato($_POST['message']) : '';

// Array para almacenar errores
$errores = [];

// Validaciones
if (empty($nombre)) {
    $errores[] = "El nombre es requerido";
} elseif (strlen($nombre) < 3 || strlen($nombre) > 50) {
    $errores[] = "El nombre debe tener entre 3 y 50 caracteres";
} elseif (!validar_nombre($nombre)) {
    $errores[] = "El nombre solo debe contener letras y espacios";
}

if (empty($email)) {
    $errores[] = "El email es requerido";
} elseif (!validar_email($email)) {
    $errores[] = "El email no es válido";
}

if (empty($telefono)) {
    $errores[] = "El teléfono es requerido";
} elseif (!validar_telefono($telefono)) {
    $errores[] = "El teléfono debe tener exactamente 10 dígitos";
}

if (empty($mensaje)) {
    $errores[] = "El mensaje es requerido";
} elseif (strlen($mensaje) < 10 || strlen($mensaje) > 500) {
    $errores[] = "El mensaje debe tener entre 10 y 500 caracteres";
}

// Si hay errores, retornarlos
if (!empty($errores)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la validación',
        'errores' => $errores
    ]);
    exit;
}

// Protección contra spam simple (honeypot)
if (isset($_POST['website']) && !empty($_POST['website'])) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Solicitud rechazada'
    ]);
    exit;
}

// Preparar el mensaje de email
$mensaje_email = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #026b64; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #026b64; }
        .value { padding: 10px; background-color: white; border-left: 3px solid #026b64; margin-top: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nuevo Mensaje de Contacto - Acquatronix</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nombre:</div>
                <div class='value'>{$nombre}</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>{$email}</div>
            </div>
            <div class='field'>
                <div class='label'>Teléfono:</div>
                <div class='value'>{$telefono}</div>
            </div>
            <div class='field'>
                <div class='label'>Mensaje:</div>
                <div class='value'>{$mensaje}</div>
            </div>
        </div>
        <div class='footer'>
            <p>Este mensaje fue enviado desde el formulario de contacto de Acquatronix</p>
            <p>Fecha: " . date('d/m/Y H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Headers del email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Formulario Acquatronix <noreply@acquatronix.com>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar el email
if (mail($destinatario, $asunto, $mensaje_email, $headers)) {
    // Opcional: Guardar en base de datos o archivo log
    // guardar_en_bd($nombre, $email, $telefono, $mensaje);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => '¡Formulario enviado exitosamente! Gracias por contactarnos.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
    ]);
}

// Opcional: Función para guardar en base de datos
/*
function guardar_en_bd($nombre, $email, $telefono, $mensaje) {
    try {
        $conn = new PDO("mysql:host=localhost;dbname=tu_base_datos", "usuario", "contraseña");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "INSERT INTO contactos (nombre, email, telefono, mensaje, fecha) 
                VALUES (:nombre, :email, :telefono, :mensaje, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':email' => $email,
            ':telefono' => $telefono,
            ':mensaje' => $mensaje
        ]);
        
        return true;
    } catch(PDOException $e) {
        error_log("Error BD: " . $e->getMessage());
        return false;
    }
}
*/
?>