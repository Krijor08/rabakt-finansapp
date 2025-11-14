package main

import (
	"fmt"
	"net/http"
)

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, world")
}

func s2(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello world, again")
}

func main() {
	http.HandleFunc("/", home)
	http.HandleFunc("/å", s2)
	http.ListenAndServe(":45631", nil)
}
