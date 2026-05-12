package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mth.models.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
