<?php

class KMySQL
{
    public $database;
    public $table;
    public $mapOfColumns = array();
    public $primaryKey;

    function __construct($database, $table)
    {
        $this->table = $table;
        $this->database = $database;

        $data =  $this->database->query("DESCRIBE " . $this->table . ";");
        $data = $data->fetchAll(PDO::FETCH_ASSOC);
        foreach ($data as $row) {
            $this->mapOfColumns[$row["Field"]] = $row["Type"];
            if ($row["Key"] == "PRI") {
                $this->primaryKey = $row["Field"];
            }
        }
    }


    function load($where = null, $orderBy = null, $limit = null)
    {

        $query = "SELECT * FROM " . $this->table;

        if ($where != null) {
            $query = $query . " WHERE " . $where;
        }
        if ($orderBy != null) {
            $query = $query . " ORDER BY " . $orderBy;
        } else {
            if ($this->primaryKey != null) {
                $query = $query . " ORDER BY " . $this->primaryKey;
            }
        }
        if ($limit != null) {
            $query = $query . " LIMIT " . $limit;
        }
        $data =  $this->database->query($query);
        $data = $data->fetchAll(PDO::FETCH_ASSOC);
        $data = json_encode($data);
        return $data;
    }


    function save($message, $fieldsExcluded = null)
    {
        try {
            $rows = $message->payload;

            foreach ($rows as $row) {
                $keys = array_keys(get_object_vars($row->data));

                if ($this->primaryKey != null) {
                    $keys = array_diff($keys, [$this->primaryKey]);
                }


                if ($fieldsExcluded != null) {
                    $keys = array_diff($keys, $fieldsExcluded);
                }


                switch ($row->status) {
                    case "insert":
                        $query = "INSERT INTO " . $this->table . " (" . implode(",", $keys) . ") VALUES (:" . implode(",:", $keys) . ")";
                        $stmt = $this->database->prepare($query);

                        foreach ($keys as $key) {
                            $stmt->bindValue(":" . $key, trim($row->data->$key));
                        }

                        $stmt->execute();
                        return "OK";
                        break;

                    case "update":
                        $query = "UPDATE " . $this->table . " SET ";
                        foreach ($keys as $key) {
                            $query .= " $key = :$key,";
                        }

                        $query = rtrim($query, ",");


                        if ($this->primaryKey != null) {
                            $query .= " WHERE " . $this->primaryKey . " = :" . $this->primaryKey;
                        }

                        //die($query);

                        $stmt = $this->database->prepare($query);

                        foreach ($keys as $key) {
                            $stmt->bindValue(":" . $key, trim($row->data->$key));
                        }

                        if ($this->primaryKey != null) {
                            $primaryKeyValue = trim(((array) $row->data)[$this->primaryKey]);
                            $stmt->bindValue(":" . $this->primaryKey, $primaryKeyValue);
                        }

                        $stmt->execute();
                        return "OK";
                        break;

                    case "delete":
                        $primaryKeyValue = trim(((array) $row->data)[$this->primaryKey]);
                        $query = "DELETE FROM " . $this->table . " WHERE " . $this->primaryKey . " = :" . $this->primaryKey;
                        $stmt = $this->database->prepare($query);
                        $stmt->bindValue(":" . $this->primaryKey, $primaryKeyValue);
                        $stmt->execute();
                        return "OK";
                        break;
                }
            }
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }
}
