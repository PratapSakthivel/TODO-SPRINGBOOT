package Todo.demo.controller;

import Todo.demo.models.todo;
import Todo.demo.service.todoservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/todos")
public class todocontroller {

    @Autowired
    private todoservice todoservice;
    @PostMapping("/create")
    ResponseEntity<todo> createuser(@RequestBody todo todo){
        return new ResponseEntity<>(todoservice.createtodo(todo),HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    ResponseEntity<todo> getuserbyid(@PathVariable long id){
        try {
            todo getbuyid = todoservice.getbyid(id);
            return new ResponseEntity<>(getbuyid , HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null , HttpStatus.NOT_FOUND);
        }

    }


    @GetMapping
    public ResponseEntity<List<todo>> getalltodos() {
        return new ResponseEntity<>(todoservice.getalltodos(), HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<todo> updatetodo(@PathVariable Long id, @RequestBody todo todo) {
        todo.setId(id);
        return new ResponseEntity<>(todoservice.updatetodo(todo), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletebyid(@PathVariable Long id) {
        todoservice.deletebyid(id);
        return new ResponseEntity<>("Todo deleted!", HttpStatus.OK);
    }
}
