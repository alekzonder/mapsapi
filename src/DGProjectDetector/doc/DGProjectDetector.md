Плагин определения проекта 2GIS
====================================

Проект — это агломерация, включающая крупный город и ближайшие населённые пункты.

Данный плагин позволяет получить информацию о просматриваемом в текущий момент времени проекте.

# API
## События

<table>
    <tr>
        <th>Событие</th>
        <th>Объект события</th>
        <th>Описание</th>
    </tr>
    <tr>
        <td>dgProjectChange</td>
        <td>ProjectEvent</td>
        <td>Возникает, когда пользователь переходит из одного проекта в другой.</td>
    </tr>
    <tr>
        <td>dgProjectLeave</td>
        <td>ProjectEvent</td>
        <td>Возникает, когда пользователь выходит за пределы текущего проекта.</td>
    </tr>
</table>

## Объекты событий
### ProjectEvent
#### Методы
<table>
    <tr>
        <th>Метод</th>
        <th>Параметры</th>
        <th>Возвращаемый тип</th>
        <th>Описание</th>
    </tr>
    <tr>
        <td>getProjectList</td>
        <td>Нет</td>
        <td>Object</td>
        <td>Возвращает все доступные проекты.</td>
    </tr>
    <tr>
        <td>getProject</td>
        <td>Нет</td>
        <td>Object</td>
        <td>Возвращает текущий проект.</td>
    </tr>
</table>

# Примеры
Подписка на событие dgProjectChange:

    map.on('dgProjectChange', function (e) {
        console.log(e);
    });

Подписка на событие dgProjectLeave:

    map.on('dgProjectLeave', function (e) {
       console.log(e);
    });