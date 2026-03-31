package Todo.demo.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NonNull;


@Entity
@Data
public class Todo {
    @Id
    @GeneratedValue

    Long id;
    @NonNull
    @NotBlank
    String title;
    @NonNull
    @NotBlank
    String description;
    @NonNull
    @NotBlank
    Boolean completed;
}
