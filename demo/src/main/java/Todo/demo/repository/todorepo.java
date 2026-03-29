package Todo.demo.repository;

import Todo.demo.models.todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface todorepo extends JpaRepository <todo, Long> {

}
