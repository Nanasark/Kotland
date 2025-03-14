// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./tilecore.sol";

contract TileUtils {
    Tile public tileDataContract;
    address admin;

    enum CropType {
        None,
        Wheat,
        Corn,
        Potato,
        Carrot
    }
    enum ResourceType {
        None,
        WheatAmount,
        CornAmount,
        PotatoAmount,
        CarrotAmount,
        FoodAmount,
        EnergyAmount,
        FactoryGoodsAmount,
        FertilizerAmount
    }
    enum FactoryType {
        None,
        FoodFactory,
        EnergyFactory,
        Bakery,
        JuiceFactory,
        BioFuelFactory
    }

    string[4] public seasons = ["winter", "spring", "summer", "monsoon"];
    uint8 public currentSeason = 0;

    constructor() {
        admin = msg.sender;
    }

    function setTileContract(address _TileContractAddress) external {
        tileDataContract = Tile(_TileContractAddress);
    }

    function calculateDynamicPrice(uint256 currentPrice)
        public
        pure
        returns (uint256)
    {
        uint256 increase = ((currentPrice / 100) *
            (currentPrice / 100) *
            2000) / 1e6;
        return currentPrice + increase;
    }

    function getHarvestResourceAndAmount(uint8 cropType)
        external
        pure
        returns (uint8 resourceType, uint8 amount)
    {
        if (cropType == uint8(CropType.Wheat))
            return (uint8(ResourceType.WheatAmount), 100);
        if (cropType == uint8(CropType.Corn))
            return (uint8(ResourceType.CornAmount), 100);
        if (cropType == uint8(CropType.Potato))
            return (uint8(ResourceType.PotatoAmount), 100);
        if (cropType == uint8(CropType.Carrot))
            return (uint8(ResourceType.CarrotAmount), 100);
        return (uint8(ResourceType.None), 0);
    }

    function plantGrowthCalculator(
        uint8 cropType,
        uint8 fertility,
        uint8 waterlevel
    ) external view returns (uint8 growth) {
        uint8 growthRate = 0;

        if (cropType == uint8(CropType.Wheat)) {
            growthRate = (currentSeason == 1)
                ? 15
                : ((currentSeason == 2 || currentSeason == 3) ? 10 : 3);
        } else if (cropType == uint8(CropType.Corn)) {
            growthRate = (currentSeason == 2)
                ? 20
                : (currentSeason == 1 ? 10 : 2);
        } else if (cropType == uint8(CropType.Potato)) {
            growthRate = (currentSeason == 0)
                ? 12
                : (currentSeason == 1 ? 7 : 3);
        } else if (cropType == uint8(CropType.Carrot)) {
            growthRate = (currentSeason == 0)
                ? 15
                : ((currentSeason == 1 || currentSeason == 3) ? 8 : 2);
        } else {
            growthRate = 0;
        }

        return (fertility % growthRate) + (waterlevel % growthRate);
    }


    // call from frontend
    function produceFromFactory(uint256 tileId) external {
        (
            uint32 id,
            address owner,
            bool isBeingUsed,
            bool isCrop,
            Tile.CropType cropType,
            Tile.FactoryType factoryType,
            uint8 fertility,
            uint8 waterLevel,
            uint8 growthStage,
            bool forSale,
            uint256 price
        ) = tileDataContract.getTileData(uint32(tileId));

        Tile.TileData memory tile = Tile.TileData(
            id,
            owner,
            isBeingUsed,
            isCrop,
            cropType,
            factoryType,
            fertility,
            waterLevel,
            growthStage,
            forSale,
            price
        );

        require(
            tileDataContract.getUserInventory(
                msg.sender,
                Tile.ResourceType.EnergyAmount
            ) > 10,
            "Not enough energy"
        );
        tileDataContract.updateInventory(
            msg.sender,
            Tile.ResourceType.EnergyAmount,
            10,
            false
        );

        if (tile.factoryType == Tile.FactoryType.FoodFactory) {
            _produceFood(msg.sender);
        } else if (tile.factoryType == Tile.FactoryType.EnergyFactory) {
            _produceEnergy(msg.sender);
        } else if (tile.factoryType == Tile.FactoryType.Bakery) {
            _produceBakery(msg.sender);
        } else if (tile.factoryType == Tile.FactoryType.JuiceFactory) {
            _produceJuice(msg.sender);
        } else if (tile.factoryType == Tile.FactoryType.BioFuelFactory) {
            _produceBioFuel(msg.sender);
        } else {
            revert("Invalid Factory Type");
        }
    }

    function _produceFood(address user) internal {
        uint64 wheat = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.WheatAmount
            )
        );
        uint64 corn = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.CornAmount
            )
        );
        uint64 potato = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.PotatoAmount
            )
        );
        uint64 carrot = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.CarrotAmount
            )
        );

        require(
            wheat >= 50 || corn >= 50 || potato >= 50 || carrot >= 50,
            "Not enough resources"
        );

        if (wheat >= 50) {
            tileDataContract.updateInventory(
                user,
                Tile.ResourceType.WheatAmount,
                50,
                false
            );
        } else if (corn >= 50) {
            tileDataContract.updateInventory(
                user,
                Tile.ResourceType.CornAmount,
                50,
                false
            );
        } else if (potato >= 50) {
            tileDataContract.updateInventory(
                user,
                Tile.ResourceType.PotatoAmount,
                50,
                false
            );
        } else if (carrot >= 50) {
            tileDataContract.updateInventory(
                user,
                Tile.ResourceType.CarrotAmount,
                50,
                false
            );
        }

        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FoodAmount,
            15,
            true
        );
    }

    function _produceEnergy(address user) internal {
        uint64 food = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.FoodAmount
            )
        );
        uint64 factorygoods = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.FactoryGoodsAmount
            )
        );

        require(food >= 20 && factorygoods >= 10, "Not enough Resources");

        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FoodAmount,
            20,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FactoryGoodsAmount,
            10,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.EnergyAmount,
            10,
            true
        ); // Fix Enum Issue
    }

    function _produceBakery(address user) internal {
        uint64 wheat = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.WheatAmount
            )
        );
        uint64 food = uint64(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.FoodAmount
            )
        );

        require(wheat >= 20 && food >= 10, "Not enough for bakery");
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.WheatAmount,
            20,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FoodAmount,
            10,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FactoryGoodsAmount,
            20,
            false
        );
    }

    function _produceJuice(address user) internal {
        require(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.CornAmount
            ) >
                20 &&
                tileDataContract.getUserInventory(
                    user,
                    Tile.ResourceType.CarrotAmount
                ) >
                10,
            "Not enough for Juice"
        );

        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.CornAmount,
            20,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.CarrotAmount,
            10,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FactoryGoodsAmount,
            20,
            true
        );
    }

    function _produceBioFuel(address user) internal {
        require(
            tileDataContract.getUserInventory(
                user,
                Tile.ResourceType.FactoryGoodsAmount
            ) >
                20 &&
                tileDataContract.getUserInventory(
                    user,
                    Tile.ResourceType.PotatoAmount
                ) >
                30,
            "Not enogh resource"
        );

        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FactoryGoodsAmount,
            20,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.PotatoAmount,
            20,
            false
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.EnergyAmount,
            5,
            true
        );
        tileDataContract.updateInventory(
            user,
            Tile.ResourceType.FertilizerAmount,
            40,
            true
        );
    }
}
