package pe.edu.ulasalle.sistemainvestigacion.core.config;

import java.util.concurrent.Executor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@EnableAsync
@Configuration
public class ConfiguracionAsincrona {

    @Bean(name = "ejecutorTareasClassroom")
    public Executor ejecutorTareasClassroom() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(12);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("classroom-task-");
        executor.initialize();
        return executor;
    }
}
