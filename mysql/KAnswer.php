<?php
class KAnswer
{
    public $text;
    public function __construct($text)
    {
        $this->text = $text;
    }

    public function __toString()
    {
        return json_encode($this);
    }
}