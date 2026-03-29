package Todo.demo.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class todo {
    @Id
    @GeneratedValue

    Long id;
    String title;
    String description;
    Boolean completed;
}
