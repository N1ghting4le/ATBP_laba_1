Feature: Контроллер умного отопления

  Scenario Outline: Проверка логики включения отопления

    Given сервис доступен по адресу "/api/status"
    When я получаю температуру из "/api/sensors/room-temp"
    And я отправляю команду котлу "<mode>" с желаемой температурой <desired>
    Then API возвращает статус-код <status>

  Examples:
    | mode      | desired | status |
    | Эко       | 25      | 200    |
    | Комфорт   | 21      | 200    |
    | Комфорт   | -300    | 400    |