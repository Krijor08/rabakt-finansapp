function Show-Menu {
    Clear-Host
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "      Node.js Docker Dev Tools   " -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host " 1) Start Docker Compose stack"
    Write-Host " 2) Rebuild and restart stack"
    Write-Host " 3) Enter Node app shell"
    Write-Host " 4) View Node app logs"
    Write-Host " 5) Stop stack"
    Write-Host " 6) Remove stack + volumes"
    Write-Host " 7) Rebuild dependencies (npm install)"
    Write-Host " 8) Run database migrations"
    Write-Host " 9) Run database seed script"
    Write-Host "10) Backup MySQL database"
    Write-Host "11) Restore MySQL database from backup"
    Write-Host "12) Run tests"
    Write-Host "13) Show running containers"
    Write-Host "14) Clean up dangling images/volumes"
    Write-Host "15) Hot rebuild Node image and restart stack"
    Write-Host "16) Show container status"
    Write-Host "17) Tail logs with timestamps"
    Write-Host "18) Open interactive Node.js REPL inside container"
    Write-Host "19) Export Node container to tar file (backup)"
    Write-Host "20) Import Node container tar backup"
    Write-Host "21) Push Docker image to Docker Hub"
    Write-Host "22) Pull Docker image from Docker Hub"
    Write-Host "23) Push project to GitHub"
    Write-Host "24) Pull project from GitHub"
    Write-Host "25) Full Dev Boot (start stack, migrate, seed, REPL)"
    Write-Host " 0) Exit"
    Write-Host "=================================" -ForegroundColor Cyan
}

do {
    Show-Menu
    $choice = Read-Host "Select an option (0-25)"

    switch ($choice) {

        "1" {
            Write-Host "Starting Docker Compose stack..." -ForegroundColor Yellow
            docker compose up -d
        }
        "2" {
            Write-Host "Rebuilding and restarting stack..." -ForegroundColor Yellow
            docker compose down -v
            docker compose build
            docker compose up -d
        }
        "3" { docker compose exec app sh }
        "4" { docker compose logs -f app }
        "5" { docker compose down }
        "6" {
            Write-Host "Removing stack + volumes..." -ForegroundColor Red
            docker compose down -v
        }
        "7" { docker compose exec app sh -c "npm install" }
        "8" { docker compose exec app sh -c "npm run migrate" }
        "9" { docker compose exec app sh -c "npm run seed" }
        "10" {
            Write-Host "Backing up MySQL database..." -ForegroundColor Yellow
            docker exec db sh -c "exec mysqldump -uiseeanoob -ppass mydb" | Out-File -Encoding ascii "./mydb-backup.sql"
            Write-Host "Backup saved as mydb-backup.sql" -ForegroundColor Green
        }
        "11" {
            if (Test-Path "./mydb-backup.sql") {
                Get-Content "./mydb-backup.sql" | docker exec -i db sh -c "mysql -uiseeanoob -ppass mydb"
                Write-Host "Database restored from mydb-backup.sql" -ForegroundColor Green
            } else {
                Write-Host "No backup file found!" -ForegroundColor Red
            }
        }
        "12" { docker compose exec app sh -c "npm test" }
        "13" { docker ps }
        "14" {
            Write-Host "Cleaning up unused images/volumes..." -ForegroundColor Yellow
            docker system prune -f
            docker volume prune -f
        }
        "15" {
            Write-Host "Hot rebuilding Node image + restarting stack..." -ForegroundColor Yellow
            docker compose stop app
            docker compose build app
            docker compose up -d app
        }
        "16" { docker compose ps }
        "17" { docker compose logs -f --timestamps app }
        "18" { docker compose exec app node }

        "19" {
            docker export app -o node-app-backup.tar
            Write-Host "Container exported as node-app-backup.tar" -ForegroundColor Green
        }
        "20" {
            if (Test-Path "./node-app-backup.tar") {
                docker import ./node-app-backup.tar node-app-imported
                Write-Host "Container imported as node-app-imported" -ForegroundColor Green
            } else {
                Write-Host "No backup tar file found!" -ForegroundColor Red
            }
        }

        "21" {
            $dockerUser = Read-Host "Enter Docker Hub username"
            $imageName = Read-Host "Enter image name (e.g. node-docker)"
            $tag = Read-Host "Enter tag (default: latest)"
            if ([string]::IsNullOrEmpty($tag)) { $tag = "latest" }

            $fullName = "${dockerUser}/${imageName}:${tag}"

            Write-Host "Tagging image node-docker as $fullName" -ForegroundColor Yellow
            docker tag node-docker $fullName

            Write-Host "Pushing $fullName to Docker Hub..." -ForegroundColor Yellow
            docker push $fullName
        }

        "22" {
            $dockerUser = Read-Host "Enter Docker Hub username"
            $imageName = Read-Host "Enter image name (e.g. node-docker)"
            $tag = Read-Host "Enter tag (default: latest)"
            if ([string]::IsNullOrEmpty($tag)) { $tag = "latest" }

            $fullName = "${dockerUser}/${imageName}:${tag}"

            Write-Host "Pulling image $fullName from Docker Hub..." -ForegroundColor Yellow
            docker pull $fullName

            Write-Host "Running container from pulled image..." -ForegroundColor Yellow
            docker run -d --name app --network my-network -p 3000:3000 $fullName

            Write-Host "Container running as app on port 3000" -ForegroundColor Green
        }

        "23" {
            git add .
            git commit -m "Update project from dev-tools.ps1"
            git push
            Write-Host "Project pushed to GitHub" -ForegroundColor Green
        }

        "24" {
            git pull
            Write-Host "Project pulled from GitHub" -ForegroundColor Green
        }

        "25" {
            Write-Host "Starting full Dev Boot..." -ForegroundColor Yellow
            docker compose up -d
            docker compose exec app sh -c "npm run migrate"
            docker compose exec app sh -c "npm run seed"
            docker compose exec app node
        }

        "0" {
            Write-Host "Exiting Dev Tools..." -ForegroundColor Cyan
            break
        }

        Default { Write-Host "Invalid option. Try again." -ForegroundColor Red }
    }

    if ($choice -ne "0") { Write-Host ""; Pause }

} while ($choice -ne "0")
