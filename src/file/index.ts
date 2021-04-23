import express, {Router} from "express";

const STATIC_FILE_DIRECTORY = "../../public"

// Router
export default express.static(STATIC_FILE_DIRECTORY)
