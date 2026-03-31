package Todo.demo.service;

import Todo.demo.models.Todo;
import Todo.demo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;


    public Todo createTodo (Todo todo){
        return todoRepository.save(todo);
    }


    public Page<Todo> gatodos(int page , int size){
        Pageable pageable = PageRequest.of(page, size);
        return todoRepository.findAll(pageable);
    }


    public Todo getById (Long id){
        return todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Todo updateTodo(Todo todo){
        return todoRepository.save(todo);
    }

    public void deleteTodo(Todo todo){
         todoRepository.delete(todo);
    }

    public void deleteById(Long id){
        todoRepository.deleteById(id);
    }

}
