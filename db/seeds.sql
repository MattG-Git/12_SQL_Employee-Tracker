INSERT INTO department (name)
VALUES  ("UX"),
        ("Delivery"),
        ("Product"),
        ("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Designer", 70000, 1 ),
        ("UX Lead", 90000, 1),
        ("Scrum Master", 85000, 2),
        ("Delivery Lead", 100000, 2),
        ("Product Owner", 110000, 3),
        ("Product Manager", 140000, 3),
        ("Software Engineer", 120000, 4),
        ("Tech Lead", 160000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("April", "Ludgate", 1, 2),
        ("Donna", "Meagle", 2, null),
        ("Ben", "Wyatt", 3, 4),
        ("Chris", "Traeger", 4, null),
        ("Leslie", "Knope", 5, 6),
        ("Ron", "Swanson", 6, null),
        ("Tom", "Haverford", 7, 8),
        ("Jerry", "Gergich", 8, null);