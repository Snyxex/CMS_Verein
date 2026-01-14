<?php
include "../../src/db.php";



function allPosts()
{
    $postsQuery = "Select p.title, c.name, p.title, p.content, p.image, p.created_at
                From posts as p, clubs as c
                Where p.club_id = c.club_id";
    exePostQuery()
}


function getPostsbyDate($date)
{
    /*$postsQuery = "Select p.title, c.name, p.title, p.content, p.image, p.created_at
                From posts as p, clubs as c
                Where p.created_at = $date  
                AND p.club_id = c.club_id";
                */
    $postsQuery = $postsQuery + "AND p.created_at = $date";
    exePostQuery()
}


function exePostQuery()
{
    $posts = query($connection, $postsQuery);
    return $posts;
}



?>
