

const columns = [
      {
        title: "Skill",
        dataIndex: "skills",
        key: "skills",
        render(items) {
          const skills = items.map((skill) => skill.name);
          return skills;
        },
      },
      {
        title: "Course Amount",
        dataIndex: "courseAmount",
        key: "courseAmount",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",

      },
    ];