<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
require_once 'connection.php';

class Esab
{
    private $conn;
    

    public function __construct()
    {
        $this->conn = Connection::getConnection();
    }

    // SELECT
    public function selectUsuarios()
    {
        $stmt = Connection::getConnection();
        $stmt = $stmt->prepare("SELECT *, TO_CHAR(data_nascimento, 'DD/MM/YYYY') AS data_nascimento_formatada FROM usuarios");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // INSERT
    public function insertUsuario($nome, $sexo, $dataNascimento, $endereco, $nacionalidade, $idEstadoCivil, $idRaca, $cpf, $rg, $telefone)
    {
        try{
            $stmt = $this->conn->prepare("INSERT INTO usuarios (nome, sexo, data_nascimento, endereco, nacionalidade, id_estado_civil, id_raca, cpf, rg, telefone) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nome, $sexo, $dataNascimento, $endereco, $nacionalidade, $idEstadoCivil, $idRaca, $cpf, $rg, $telefone]);

        } catch (PDOException $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }

    // UPDATE
    public function updateUsuario($id, $nome, $sexo, $dataNascimento, $endereco, $nacionalidade, $idEstadoCivil, $idRaca, $cpf, $rg, $telefone)
    {
        $stmt = $this->conn->prepare("UPDATE usuarios 
                                     SET nome=?, sexo=?, data_nascimento=?, endereco=?, nacionalidade=?, id_estado_civil=?, id_raca=?, cpf=?, rg=?, telefone=? 
                                     WHERE id=?");
        $stmt->execute([$nome, $sexo, $dataNascimento, $endereco, $nacionalidade, $idEstadoCivil, $idRaca, $cpf, $rg, $telefone, $id]);
    }

    // DELETE
    public function deleteUsuario($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM usuarios WHERE id=?");
        $stmt->execute([$id]);
    }
}
if (isset($_POST['action'])) {

$obj = new Esab();

switch ($_POST['action']) {
    case 'getAll':
        $result = $obj->selectUsuarios();
        header("Content-type:application/x-www-form-urlencoded; charset = utf-8");
        echo json_encode($result);
        return json_encode($result);
    break;

    case 'insert':
        $obj->insertUsuario($_POST['nome'], $_POST['sexo'], $_POST['dataNascimento'], $_POST['endereco'], $_POST['nacionalidade'], $_POST['idEstadoCivil'], $_POST['idRaca'], $_POST['cpf'], $_POST['rg'], $_POST['telefone']);
    break;

    case 'edit':
        $obj->updateUsuario($_POST['id'], $_POST['nome'], $_POST['sexo'], $_POST['dataNascimento'], $_POST['endereco'], $_POST['nacionalidade'], $_POST['idEstadoCivil'], $_POST['idRaca'], $_POST['cpf'], $_POST['rg'], $_POST['telefone']);
    break;

    case 'delete':
        $obj->deleteUsuario($_POST['id']);
    break;
}

}
?>