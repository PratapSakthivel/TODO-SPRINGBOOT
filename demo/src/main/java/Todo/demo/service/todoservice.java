package Todo.demo.service;

import Todo.demo.models.todo;
import Todo.demo.repository.todorepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

@Service
public class todoservice {

    @Autowired
    private todorepo todorepo;


    public todo createtodo (todo Todo){
        return todorepo.save(Todo);
    }


    public todo getbyid (Long id){
        return todorepo.findById(id).orElseThrow(() -> new RuntimeException("todo not found raa"));
    }

    public List<todo> getalltodos() {
        return todorepo.findAll();
    }

    public todo updatetodo(todo todo){
        return todorepo.save(todo);
    }

    public void  deletetodo(todo todo){
         todorepo.delete(todo);
    }

    public void deletebyid(Long id){
        todorepo.deleteById(id);
    }



}
