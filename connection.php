<?php
class Connection{
    public static function getConnection() {
        $host = "localhost";
        $port = "5432";
        $dbname = "esab";
        $user = "postgres";
        $password = "grafite29";

        try {
            $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password");
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
            echo "Conexão bem-sucedida";
        } catch(PDOException $e) {
            echo "Erro na conexão: " . $e->getMessage();
        }
    }
}
?>